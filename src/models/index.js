import User from './userModel.js'
import UserPokemon from './userPokemonModel.js'
import Team from './teamModel.js'
import TeamPokemon from './teamPokemonModel.js'
import Pokemon from './pokemonModel.js'
import Product from './productsModel.js'
import UserStore from './userStoreModel.js'
import { Order } from './orderModel.js'
import { OrderItem } from './orderItemModel.js' 

// =======================
// RELACIONES
// =======================

// Un usuario puede tener muchos Pokémon (con sus stats individuales)
User.hasMany(UserPokemon, { foreignKey: 'user_id_user', onDelete: 'CASCADE' })
UserPokemon.belongsTo(User, { foreignKey: 'user_id_user' })

// Un usuario puede tener muchos equipos
User.hasMany(Team, { foreignKey: 'id_user', onDelete: 'CASCADE' })
Team.belongsTo(User, { foreignKey: 'id_user' })

// Un equipo tiene hasta 6 slots (TeamPokemon)
Team.hasMany(TeamPokemon, { foreignKey: 'team_id', onDelete: 'CASCADE' })
TeamPokemon.belongsTo(Team, { foreignKey: 'team_id' })

// Cada slot apunta a un UserPokemon concreto
TeamPokemon.belongsTo(UserPokemon, { foreignKey: 'user_pokemon_id' })

// Cada UserPokemon referencia al Pokémon base del catálogo
UserPokemon.belongsTo(Pokemon, { foreignKey: 'pokemon_id_pokemon' })

// Relación M:N entre User y Product a través de UserStore
User.belongsToMany(Product, { through: UserStore, foreignKey: 'user_id_user' })
Product.belongsToMany(User, { through: UserStore, foreignKey: 'store_id_product' })

// Alias 'product' necesario para los includes en userStoreService
UserStore.belongsTo(Product, { foreignKey: 'store_id_product', as: 'product' })
UserStore.belongsTo(User, { foreignKey: 'user_id_user' })

// Relación entre Order y OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id' })
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })

// Relación entre OrderItem y Product
OrderItem.belongsTo(Product, { foreignKey: 'product_id' })
Product.hasMany(OrderItem, { foreignKey: 'product_id' })

// ORDER → USER
Order.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Order, { foreignKey: 'user_id' })  

export { User, UserPokemon, Team, TeamPokemon, Pokemon, Product, UserStore, Order, OrderItem }

