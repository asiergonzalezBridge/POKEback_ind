import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import sequelize from './config/db.js'

import routes from './routes/index.js'
import authRoutes from './routes/authRoutes.js'
import viewRoutes from './routes/viewRoutes.js'

import session from 'express-session'

import path from 'path'
import { fileURLToPath } from 'url'

import adminRoutes from './routes/adminRoutes.js'

// 1. CREAR APP PRIMERO
const app = express()

app.use(express.json())
// Línea de Claude: Añade al usuario dentro de la tabla users
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true
  }
}))

app.use('/admin', adminRoutes)

// VISTAS 
app.set('view engine', 'pug')
app.set('views', './src/views')
app.use(express.static('./public'))

// USUARIO DISPONIBLE EN TODAS LAS VISTAS 
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null
  next()
})

// RUTAS
app.get("/", (req, res) => {
  res.render("index")
})

app.use('/', viewRoutes)
app.use('/api/auth', authRoutes)
app.use('/api', routes)

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('❌ Error detectado:', err.message)
  res.status(err.statusCode || 500).json({
    error: err.message || 'Error interno del servidor'
  })
})

// START SERVER
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Base de datos conectada en puerto 5440')

    await sequelize.sync({ force: false })
    console.log('✅ Modelos sincronizados')

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`🚀 Servidor listo en http://localhost:${PORT}`)
    })

  } catch (error) {
    console.error('❌ Error al iniciar:', error)
  }
}

startServer()