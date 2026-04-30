import { getUserStore } from '../services/userStoreService.js'
import { getUserPokemons } from '../services/userPokemonService.js'

export const getDashboard = async (req, res) => {
  const user = req.session.user

  const items = await getUserStore(user.id_user)
  const pokemons = await getUserPokemons(user.id_user)

  res.render('dashboard', {
    user,
    items,
    pokemons
  })
}