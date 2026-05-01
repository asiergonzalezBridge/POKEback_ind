import * as battleService from '../services/battleService.js'
import UserPokemon from '../models/userPokemonModel.js'
import Pokemon from '../models/pokemonModel.js'

export const getBattleSelect = async (req, res, next) => {
  try {
    const userId = req.session.user.id
    console.log('userId:', userId)

    const pokemons = await UserPokemon.findAll({
      where: { user_id_user: userId },
      include: [{ model: Pokemon }]
    })

    console.log('pokemons encontrados:', pokemons.length)

    const available = (pokemons || []).filter(p => p.current_hp > 0)

    console.log('available:', available.length)

    res.render('battle-select', {
      user: req.session.user,
      pokemons: available
    })
  } catch (error) {
    console.error('Error en getBattleSelect:', error)
    next(error)
  }
}


// POST /battle/start
// Inicia la batalla con el Pokémon elegido
export const postBattleStart = async (req, res, next) => {
  try {
    const userId        = req.session.user.id
    const userPokemonId = Number(req.body.userPokemonId)

    const battleState = await battleService.startBattle(userId, userPokemonId)
    req.session.battle = battleState

    res.redirect('/battle/fight')
  } catch (error) {
    next(error)
  }
}

// GET /battle/fight
// Muestra el estado actual del combate
export const getBattleFight = (req, res) => {
  const battle = req.session.battle

  if (!battle) return res.redirect('/battle')

  res.render('battle-fight', {
    user:   req.session.user,
    battle
  })
}

// POST /battle/turn
// Procesa la acción elegida en el turno
export const postBattleTurn = async (req, res, next) => {
  try {
    const battle = req.session.battle
    if (!battle) return res.redirect('/battle')

    const action = req.body.action // 'attack' | 'capture' | 'flee'

    const updatedBattle = await battleService.processTurn(battle, action)
    req.session.battle  = updatedBattle

    // Si la batalla terminó, limpiamos la sesión de batalla
    if (updatedBattle.result !== null) {
      req.session.battleResult = {
        result:  updatedBattle.result,
        log:     updatedBattle.log,
        enemy:   updatedBattle.enemyName
      }
      req.session.battle = null
      return res.redirect('/battle/result')
    }

    res.redirect('/battle/fight')
  } catch (error) {
    next(error)
  }
}

// GET /battle/result
// Muestra el resultado final
export const getBattleResult = (req, res) => {
  const result = req.session.battleResult

  if (!result) return res.redirect('/battle')

  req.session.battleResult = null

  res.render('battle-result', {
    user: req.session.user,
    result
  })
}

