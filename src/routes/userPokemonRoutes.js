import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getUserPokemons } from "../controllers/userPokemonController.js";

const router = Router();

// protegido
router.use(verifyToken);

// GET pokemons de un usuario
router.get("/:id", getUserPokemons); // 

export default router;