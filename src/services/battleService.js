import Pokemon from '../models/pokemonModel.js'
import UserPokemon from '../models/userPokemonModel.js'
import User from '../models/userModel.js'
import Battle from '../models/battleModel.js'
import { Op } from 'sequelize'

const COINS_WIN = 20
const CAPTURE_HP_HIGH = 0.20   // 20% si HP > 30%
const CAPTURE_HP_LOW  = 0.60   // 60% si HP <= 30%

// Escala stats del enemigo según su tipo
function scaleEnemyStats(pokemon) {
  const aggressive = ['fire', 'electric']
  const isAggressive = aggressive.includes(pokemon.type)

  const baseHp     = 80
  const baseAtk    = 40
  const baseSpd    = 40

  return {
    hp:     isAggressive ? Math.floor(baseHp  * 0.9) : Math.floor(baseHp  * 1.3),
    attack: isAggressive ? Math.floor(baseAtk * 1.5) : Math.floor(baseAtk * 0.8),
    speed:  Math.floor(baseSpd + Math.random() * 20)
  }
}

// Inicia una batalla: selecciona enemigo aleatorio y devuelve estado inicial
export async function startBattle(userId, userPokemonId) {
  const userPokemon = await UserPokemon.findOne({
    where: { id_user_pokemon: userPokemonId, user_id_user: userId },
    include: [{ model: Pokemon }]
  })

  if (!userPokemon) throw new Error('Pokémon no encontrado')
  if (userPokemon.current_hp <= 0) throw new Error('Este Pokémon está debilitado')

  // Enemigo aleatorio distinto al que llevas
const count = await Pokemon.count()
const randomOffset = Math.floor(Math.random() * count)

const enemy = await Pokemon.findOne({
  where: { id_pokemon: { [Op.ne]: userPokemon.pokemon_id_pokemon } },
  offset: randomOffset % (count - 1)  // evita salirse del rango
})

  const enemyStats = scaleEnemyStats(enemy)

  return {
    userId,
    userPokemonId,
    userHp:       userPokemon.current_hp,
    userAttack:   userPokemon.current_attack,
    userName:     userPokemon.Pokemon.name,
    enemyId:      enemy.id_pokemon,
    enemyName:    enemy.name,
    enemyType:    enemy.type,
    enemyHp:      enemyStats.hp,
    enemyMaxHp:   enemyStats.hp,
    enemyAttack:  enemyStats.attack,
    enemySpeed:   enemyStats.speed,
    log:          [`¡Un ${enemy.name} salvaje apareció!`]
  }
}


// Procesa un turno según la acción elegida
// action: 'attack' | 'capture' | 'flee'
export async function processTurn(battle, action) {
  const log = []
  let result = null  // 'win' | 'loss' | 'flee' | null (continúa)

  if (action === 'flee') {
    log.push('Escapaste de la batalla.')
    await saveBattle(battle, 'flee', 0)
    return { ...battle, log, result: 'flee' }
  }

  if (action === 'attack') {
    // Jugador ataca
    battle.enemyHp -= battle.userAttack
    log.push(`${battle.userName} atacó causando ${battle.userAttack} de daño.`)

    if (battle.enemyHp <= 0) {
      battle.enemyHp = 0
      log.push(`¡${battle.enemyName} fue derrotado! +${COINS_WIN} monedas.`)
      await saveBattle(battle, 'win', COINS_WIN)
      await addCoins(battle.userId, COINS_WIN)
      return { ...battle, log, result: 'win' }
    }
  }

  if (action === 'capture') {
    const hpRatio = battle.enemyHp / battle.enemyMaxHp
    const chance  = hpRatio <= 0.3 ? CAPTURE_HP_LOW : CAPTURE_HP_HIGH
    const success = Math.random() < chance

    if (success) {
      log.push(`¡Capturaste a ${battle.enemyName}!`)
      await captureEnemy(battle)
      await saveBattle(battle, 'win', COINS_WIN)
      await addCoins(battle.userId, COINS_WIN)
      return { ...battle, log, result: 'captured' }
    } else {
      log.push(`Fallaste la captura de ${battle.enemyName}.`)
    }
  }

  // Contraataque del enemigo (siempre ocurre si no escapaste ni ganaste)
  battle.userHp -= battle.enemyAttack
  log.push(`${battle.enemyName} contraatacó causando ${battle.enemyAttack} de daño.`)

  if (battle.userHp <= 0) {
    battle.userHp = 0
    log.push(`¡${battle.userName} fue derrotado y perdido para siempre!`)
    await killUserPokemon(battle.userPokemonId)
    await saveBattle(battle, 'loss', 0)
    return { ...battle, log, result: 'loss' }
  }

  return { ...battle, log, result: null }
}

// ── Helpers de BD ──────────────────────────────────────────────

async function saveBattle(battle, result, coinsEarned) {
  await Battle.create({
    user_id:           battle.userId,
    user_pokemon_id:   battle.userPokemonId,
    enemy_pokemon_id:  battle.enemyId,
    enemy_hp:          battle.enemyHp,
    enemy_attack:      battle.enemyAttack,
    result,
    coins_earned:      coinsEarned
  })
}

async function addCoins(userId, amount) {
  await User.increment({ coins: amount }, { where: { id_user: userId } })
}

async function captureEnemy(battle) {
  await UserPokemon.create({
    user_id_user:       battle.userId,
    pokemon_id_pokemon: battle.enemyId,
    current_hp:         80,   // se regenera al 100% del base
    current_attack:     battle.enemyAttack,
    current_speed:      battle.enemySpeed
  })
}

async function killUserPokemon(userPokemonId) {
await saveBattle(battle, 'loss', 0)
await killUserPokemon(battle.userPokemonId)}
