import User from './userModel.js'
import UserPokemon from './userPokemonModel.js'
import Team from './teamModel.js'
import TeamPokemon from './teamPokemonModel.js'
import Pokemon from './pokemonModel.js'
import Product from './productsModel.js'
import UserStore from './userStoreModel.js'
// =======================
// RELACIONES
// =======================

// USER → USER_POKEMON
User.hasMany(UserPokemon, { 
  foreignKey: 'user_id_user',
  onDelete: 'CASCADE'
})

UserPokemon.belongsTo(User, { 
  foreignKey: 'user_id_user'
})


// USER → TEAM
User.hasMany(Team, { 
  foreignKey: 'id_user',
  onDelete: 'CASCADE'
})

Team.belongsTo(User, { 
  foreignKey: 'id_user'
})


// TEAM → TEAM_POKEMON
Team.hasMany(TeamPokemon, { 
  foreignKey: 'team_id',
  onDelete: 'CASCADE'
})

TeamPokemon.belongsTo(Team, { 
  foreignKey: 'team_id'
})


// TEAM_POKEMON → USER_POKEMON
TeamPokemon.belongsTo(UserPokemon, { 
  foreignKey: 'user_pokemon_id'
})


// USER_POKEMON → POKEMON
UserPokemon.belongsTo(Pokemon, { 
  foreignKey: 'pokemon_id_pokemon'
})

// USER → USER_STORE
User.belongsToMany(Product, {
  through: UserStore,
  foreignKey: 'user_id_user'
})

Product.belongsToMany(User, {
  through: UserStore,
  foreignKey: 'store_id_product'
})

UserStore.belongsTo(Product, { foreignKey: 'store_id_product', as: 'product' })
UserStore.belongsTo(User, { foreignKey: 'user_id_user' })

// EXPORT
export { User, UserPokemon, Team, TeamPokemon, Pokemon, Product, UserStore }