import express from 'express'
import {
    getAllPokemons,
    getPokemonById,
    createPokemon,
    updatePokemon,
    deletePokemon
} from '../controllers/pokemonController.js'

const router = express.Router()

router.get('/', getAllPokemons)
router.get('/:id', getPokemonById)
router.post('/', createPokemon)
router.patch('/:id', updatePokemon)
router.delete('/:id', deletePokemon)

export default router