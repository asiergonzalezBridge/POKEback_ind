import * as userService from '../services/userService.js'

// GET ALL
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

// GET BY ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

// CREATE
export const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

// UPDATE
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body)
    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
}

// DELETE
export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
//PROFILE
import { User } from '../models/index.js'

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(user)

  } catch (error) {
    next(error)
  }
}