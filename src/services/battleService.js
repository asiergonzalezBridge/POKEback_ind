import Pokemon from '../models/pokemonModel.js'
import UserPokemon from '../models/userPokemonModel.js'
import User from '../models/userModel.js'
import Battle from '../models/battleModel.js'
import { Op } from 'sequelize'

const COINS_WIN = 20
const CAPTURE_HP_HIGH = 0.20
const CAPTURE_HP_LOW  = 0.60

function scaleEnemyStats(pokemon) {
  const aggressive = ['fire', 'electric']
  const isAggressive = aggressive.includes(pokemon.type)
  const baseHp  = 80
  const baseAtk = 40
  const baseSpd = 40
  return {
    hp:     isAggressive ? Math.floor(baseHp  * 0.9) : Math.floor(baseHp  * 1.3),
    attack: isAggressive ? Math.floor(baseAtk * 1.5) : Math.floor(baseAtk * 0.8),
    speed:  Math.floor(baseSpd + Math.random() * 20)
  }
}

export async function startBattle(userId, userPokemonId) {
  console.log(`[startBattle] userId=${userId} userPokemonId=${userPokemonId}`)
  try {
    const userPokemon = await UserPokemon.findOne({
      where: { id_user_pokemon: userPokemonId, user_id_user: userId },
      include: [{ model: Pokemon }]
    })

    if (!userPokemon) throw new Error(`Pokémon id=${userPokemonId} no encontrado para user=${userId}`)
    if (userPokemon.current_hp <= 0) throw new Error(`Pokémon ${userPokemonId} está debilitado (HP=0)`)

    console.log(`[startBattle] userPokemon: ${userPokemon.Pokemon.name} HP=${userPokemon.current_hp} ATK=${userPokemon.current_attack}`)

    const count = await Pokemon.count()
    console.log(`[startBattle] total pokemon en BD: ${count}`)

    if (count < 2) throw new Error('No hay suficientes Pokémon en la BD para generar un enemigo')

    const randomOffset = Math.floor(Math.random() * (count - 1))
    console.log(`[startBattle] randomOffset=${randomOffset}`)

    const enemy = await Pokemon.findOne({
      where: { id_pokemon: { [Op.ne]: userPokemon.pokemon_id_pokemon } },
      offset: randomOffset
    })

    if (!enemy) throw new Error('No se pudo encontrar un enemigo aleatorio')
    console.log(`[startBattle] enemigo: ${enemy.name} tipo=${enemy.type}`)

    const enemyStats = scaleEnemyStats(enemy)
    console.log(`[startBattle] enemyStats:`, enemyStats)

    return {
      userId,
      userPokemonId,
      userHp:      userPokemon.current_hp,
      userAttack:  userPokemon.current_attack,
      userName:    userPokemon.Pokemon.name,
      enemyId:     enemy.id_pokemon,
      enemyName:   enemy.name,
      enemyType:   enemy.type,
      enemyHp:     enemyStats.hp,
      enemyMaxHp:  enemyStats.hp,
      enemyAttack: enemyStats.attack,
      enemySpeed:  enemyStats.speed,
      log: [`¡Un ${enemy.name} salvaje apareció!`]
    }
  } catch (error) {
    console.error('[startBattle] ERROR:', error.message)
    throw error
  }
}

export async function processTurn(battle, action) {
  console.log(`[processTurn] action=${action} userHp=${battle.userHp} enemyHp=${battle.enemyHp}`)
  const log = []

  try {
    if (action === 'flee') {
      log.push('Escapaste de la batalla.')
      await saveBattle(battle, 'flee', 0)
      console.log('[processTurn] resultado: flee')
      return { ...battle, log, result: 'flee' }
    }

    if (action === 'attack') {
      battle.enemyHp -= battle.userAttack
      log.push(`${battle.userName} atacó causando ${battle.userAttack} de daño.`)
      console.log(`[processTurn] ataque → enemyHp restante: ${battle.enemyHp}`)

      if (battle.enemyHp <= 0) {
        battle.enemyHp = 0
        log.push(`¡${battle.enemyName} fue derrotado! +${COINS_WIN} monedas.`)
        await saveBattle(battle, 'win', COINS_WIN)
        await addCoins(battle.userId, COINS_WIN)
        console.log('[processTurn] resultado: win')
        return { ...battle, log, result: 'win' }
      }
    }

    if (action === 'capture') {
      const hpRatio = battle.enemyHp / battle.enemyMaxHp
      const chance  = hpRatio <= 0.3 ? CAPTURE_HP_LOW : CAPTURE_HP_HIGH
      const roll    = Math.random()
      const success = roll < chance
      console.log(`[processTurn] captura → hpRatio=${hpRatio.toFixed(2)} chance=${chance} roll=${roll.toFixed(2)} success=${success}`)

      if (success) {
        log.push(`¡Capturaste a ${battle.enemyName}!`)
        await captureEnemy(battle)
        await saveBattle(battle, 'captured', COINS_WIN)
        await addCoins(battle.userId, COINS_WIN)
        console.log('[processTurn] resultado: captured')
        return { ...battle, log, result: 'captured' }
      } else {
        log.push(`Fallaste la captura de ${battle.enemyName}.`)
      }
    }

    // Contraataque del enemigo
    battle.userHp -= battle.enemyAttack
    log.push(`${battle.enemyName} contraatacó causando ${battle.enemyAttack} de daño.`)
    console.log(`[processTurn] contraataque → userHp restante: ${battle.userHp}`)

    if (battle.userHp <= 0) {
      battle.userHp = 0
      log.push(`¡${battle.userName} fue derrotado y perdido para siempre!`)
      console.log(`[processTurn] resultado: loss → eliminando userPokemon id=${battle.userPokemonId}`)
      await saveBattle(battle, 'loss', 0)
      await killUserPokemon(battle.userPokemonId)
      return { ...battle, log, result: 'loss' }
    }

    console.log('[processTurn] turno completado, combate continúa')
    return { ...battle, log, result: null }

  } catch (error) {
    console.error('[processTurn] ERROR:', error.message)
    throw error
  }
}

// ── Helpers de BD ──────────────────────────────────────────────

async function saveBattle(battle, result, coinsEarned) {
  console.log(`[saveBattle] result=${result} coins=${coinsEarned} userPokemonId=${battle.userPokemonId} enemyId=${battle.enemyId}`)
  try {
    await Battle.create({
      user_id:          battle.userId,
      user_pokemon_id:  battle.userPokemonId,
      enemy_pokemon_id: battle.enemyId,
      enemy_hp:         battle.enemyHp,
      enemy_attack:     battle.enemyAttack,
      result,
      coins_earned:     coinsEarned
    })
    console.log('[saveBattle] OK')
  } catch (error) {
    console.error('[saveBattle] ERROR:', error.message)
    throw error
  }
}

async function addCoins(userId, amount) {
  console.log(`[addCoins] userId=${userId} +${amount}`)
  try {
    await User.increment({ coins: amount }, { where: { id_user: userId } })
    console.log('[addCoins] OK')
  } catch (error) {
    console.error('[addCoins] ERROR:', error.message)
    throw error
  }
}

async function captureEnemy(battle) {
  console.log(`[captureEnemy] pokemonId=${battle.enemyId} userId=${battle.userId}`)
  try {
    await UserPokemon.create({
      user_id_user:       battle.userId,
      pokemon_id_pokemon: battle.enemyId,
      current_hp:         80,
      current_attack:     battle.enemyAttack,
      current_speed:      battle.enemySpeed
    })
    console.log('[captureEnemy] OK')
  } catch (error) {
    console.error('[captureEnemy] ERROR:', error.message)
    throw error
  }
}

async function killUserPokemon(userPokemonId) {
  console.log(`[killUserPokemon] eliminando id=${userPokemonId}`)
  try {
    const deleted = await UserPokemon.destroy({ where: { id_user_pokemon: userPokemonId } })
    console.log(`[killUserPokemon] filas eliminadas: ${deleted}`)
  } catch (error) {
    console.error('[killUserPokemon] ERROR:', error.message)
    throw error
  }
}