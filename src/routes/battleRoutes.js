import { Router } from 'express'
import { requireSession } from '../middlewares/sessionMiddleware.js'
import * as battleController from '../controllers/battleController.js'

const router = Router()

router.get('/',         requireSession, battleController.getBattleSelect)
router.post('/start',   requireSession, battleController.postBattleStart)
router.get('/fight',    requireSession, battleController.getBattleFight)
router.post('/turn',    requireSession, battleController.postBattleTurn)
router.get('/result',   requireSession, battleController.getBattleResult)

export default router
