import { Router } from 'express'
import {
  getUserStore,
  buyProduct,
  removeProduct
} from '../controllers/userStoreController.js'

const router = Router()

router.get('/userstore/:id', getUserStore)
router.post('/userstore', buyProduct)
router.delete('/userstore', removeProduct)

export default router