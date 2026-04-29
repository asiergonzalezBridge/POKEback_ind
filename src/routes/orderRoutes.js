import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { getOrders } from '../controllers/orderController.js'

const router = express.Router()

router.get('/', verifyToken, getOrders)

export default router