import * as adminService from '../services/adminService.js'

export const getAdminPanel = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers()
    const products = await adminService.getAllProducts()
    const purchases = await adminService.getAllPurchases()
    res.render('admin', { users, products, purchases, user: req.session.user })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id)
    res.redirect('/admin')
  } catch (error) {
    next(error)
  }
}

export const editUser = async (req, res, next) => {
  try {
    await adminService.editUser(req.params.id, req.body)
    res.redirect('/admin')
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    await adminService.createProduct(req.body)
    res.redirect('/admin')
  } catch (error) {
    next(error)
  }
}

export const editProduct = async (req, res, next) => {
  try {
    await adminService.editProduct(req.params.id, req.body)
    res.redirect('/admin')
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    await adminService.deleteProduct(req.params.id)
    res.redirect('/admin')
  } catch (error) {
    next(error)
  }
}