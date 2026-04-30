import express from 'express'
import * as cartController from '../controllers/cartController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { requireSession } from '../middlewares/sessionMiddleware.js'
 

const router = express.Router()

router.get('/', requireSession, cartController.getCart)
router.post('/add', requireSession, cartController.addToCart)
router.post('/remove/:productId', requireSession, cartController.removeFromCart)
router.put('/update', requireSession, cartController.updateQuantity)
router.post('/clear', requireSession, cartController.clearCart)
router.get('/total', requireSession, cartController.getCartTotal)

router.get('/count', requireSession, cartController.getCartCount)


router.post('/checkout', requireSession, cartController.checkout)

export default router



