import { Router } from 'express'
import { requireSession, requireAdminSession } from '../middlewares/sessionMiddleware.js'
import * as adminController from '../controllers/adminController.js'

const router = Router()

// Todas las rutas del panel requieren sesión y rol admin
router.use(requireSession, requireAdminSession)

// Panel principal
router.get('/', adminController.getAdminPanel)

// CRUD usuarios
router.post('/users/:id/delete', adminController.deleteUser)

// CRUD productos
router.post('/products/create', adminController.createProduct)
router.post('/products/:id/edit', adminController.editProduct)
router.post('/products/:id/delete', adminController.deleteProduct)

// Editar usuarios
router.post('/users/:id/edit', adminController.editUser)

export default router