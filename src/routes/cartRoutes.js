import express from 'express'
import * as cartController from '../controllers/cartController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
 

const router = express.Router()

router.get('/', verifyToken, cartController.getCart)
router.post('/add', verifyToken, cartController.addToCart)
router.delete('/remove/:productId', verifyToken, cartController.removeFromCart)
router.put('/update', verifyToken, cartController.updateQuantity)
router.delete('/clear', verifyToken, cartController.clearCart)
router.get('/total', verifyToken, cartController.getCartTotal)

router.get('/count', verifyToken, cartController.getCartCount)


router.post('/checkout', verifyToken, cartController.checkout)

export default router



