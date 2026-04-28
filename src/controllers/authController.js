import authService from '../services/authService.js'

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}


export const login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body)
    res.json({ token })
  } catch (error) {
    next(error)
  }
}

// LOGIN VISTAS (SESIÓN)
export const loginView = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await authService.loginUser(email, password)

    req.session.user = {
      id: user.id_user,
      email: user.email,
      rol: user.rol,
      username: user.username,
      coins: user.coins 
    }

    res.redirect('/dashboard')

  } catch (error) {
    res.render('login', { error: 'Email o contraseña incorrectos' })
  }
}