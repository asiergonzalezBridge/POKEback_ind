import { Router } from 'express';
import userRoutes from './userRoutes.js';
import teamRouter from './teamRouter.js';
import pokemonRoutes from './pokemonRoutes.js';
import productRoutes from './productsRoute.js';
import authRoutes from './authRoutes.js';
import userPokemonRoutes from './userPokemonRoutes.js';
import viewRoutes from './viewRoutes.js';
import userStoreRoutes from './userStoreRoutes.js'
const router = Router();

router.use('/users', userRoutes);
router.use('/team', teamRouter);
router.use('/pokemon', pokemonRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/userpokemon', userPokemonRoutes);
router.use('/view', viewRoutes);
router.use('/', userStoreRoutes);

export default router;