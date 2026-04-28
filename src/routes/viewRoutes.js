import { Router } from 'express'
import { loginView } from '../controllers/authController.js'
import { requireSession } from '../middlewares/sessionMiddleware.js'
import authService from '../services/authService.js'
import UserPokemon from '../models/userPokemonModel.js'
import Pokemon from '../models/pokemonModel.js'
import Team from '../models/teamModel.js'
import TeamPokemon from '../models/teamPokemonModel.js'
import Product from '../models/productsModel.js'

const router = Router()

// ==========================================
// AUTH
// ==========================================

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', loginView)

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { password, confirm_password } = req.body

    if (password !== confirm_password) {
      return res.render('register', { error: 'Las contraseñas no coinciden' })
    }

    const newUser = await authService.register(req.body)

    // Iniciar sesión automáticamente tras el registro
    req.session.user = {
      id: newUser.id_user,
      email: newUser.email,
      rol: newUser.rol,
      username: newUser.username,
      coins: newUser.coins
    }

    res.redirect('/dashboard')

  } catch (error) {
    res.render('register', { error: error.message })
  }
})

router.get('/dashboard', requireSession, (req, res) => {
  res.render('dashboard', { user: req.session.user })
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
})

// ==========================================
// MIS POKÉMON
// Soporta ordenamiento alfabético por nombre (ASC/DESC) via ?sort=
// ==========================================
router.get('/pokemon', requireSession, async (req, res) => {
  try {
    const validOrders = ['ASC', 'DESC']
    const sort = validOrders.includes(req.query.sort?.toUpperCase())
      ? req.query.sort.toUpperCase()
      : null

    const pokemons = await UserPokemon.findAll({
      where: { user_id_user: req.session.user.id },
      include: { model: Pokemon },
      order: sort
        ? [[Pokemon, 'name', sort]]
        : [['id_user_pokemon', 'ASC']] // orden de inserción por defecto
    })

    res.render('pokemon', {
      user: req.session.user,
      pokemons,
      currentSort: sort || ''
    })
  } catch (error) {
    res.status(500).send('Error al cargar los pokémon')
  }
})

// ==========================================
// MIS EQUIPOS
// ==========================================
router.get('/teams', requireSession, async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { id_user: req.session.user.id },
      include: {
        model: TeamPokemon,
        include: {
          model: UserPokemon,
          include: { model: Pokemon }
        }
      }
    })
    res.render('teams', { teams })
  } catch (error) {
    res.status(500).send('Error al cargar los equipos')
  }
})

// ==========================================
// TIENDA
// Soporta filtrado por tipo (?type=) y rango de precio (?minPrice= &maxPrice=),
// ordenamiento alfabético (?sort=ASC|DESC) y paginación (?page=) de 6 en 6.
// Todos los filtros son combinables entre sí y se preservan en la paginación.
// ==========================================
router.get('/store', requireSession, async (req, res) => {
  try {
    const limit = 6
    const page = parseInt(req.query.page) || 1
    const offset = (page - 1) * limit

    const where = {}

    if (req.query.type) {
      where.type = req.query.type
    }

    if (req.query.minPrice || req.query.maxPrice) {
      const { Op } = await import('sequelize')
      where.price = {}
      if (req.query.minPrice) where.price[Op.gte] = parseFloat(req.query.minPrice)
      if (req.query.maxPrice) where.price[Op.lte] = parseFloat(req.query.maxPrice)
    }

    const validOrders = ['ASC', 'DESC']
    const sort = validOrders.includes(req.query.sort?.toUpperCase())
      ? req.query.sort.toUpperCase()
      : null

    const order = sort
      ? [['name', sort]]
      : [['id_product', 'ASC']] // orden de inserción por defecto

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order
    })

    const totalPages = Math.ceil(count / limit)

    res.render('store', {
      user: req.session.user,
      products,
      currentPage: page,
      totalPages,
      currentType: req.query.type || '',
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || '',
      currentSort: sort || ''
    })
  } catch (error) {
    res.status(500).send('Error al cargar la tienda')
  }
})

export default router
