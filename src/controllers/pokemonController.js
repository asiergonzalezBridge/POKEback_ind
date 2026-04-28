import {
    getAllPokemonsService,
    getPokemonByIdService,
    createPokemonService,
    updatePokemonService,
    deletePokemonService
} from '../services/pokemonService.js'

export const getAllPokemons = async (req, res) => {
    try {
        const pokemons = await getAllPokemonsService()
        res.json(pokemons)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pokemons' })
    }
}

export const getPokemonById = async (req, res) => {
    try {
        const pokemon = await getPokemonByIdService(req.params.id)
        res.json(pokemon)
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Pokemon no encontrado' })
        }
        res.status(500).json({ error: 'Error al obtener el pokemon' })
    }
}

export const createPokemon = async (req, res) => {
    try {
        const newPokemon = await createPokemonService(req.body)
        res.status(201).json(newPokemon)
    } catch (error) {
        res.status(500).json({ error: 'Error al crear pokemon' })
    }
}

export const updatePokemon = async (req, res) => {
    try {
        const updatedPokemon = await updatePokemonService(
            req.params.id,
            req.body
        )

        res.json(updatedPokemon)
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Pokemon no encontrado' })
        }
        res.status(500).json({ error: 'Error al actualizar pokemon' })
    }
}

export const deletePokemon = async (req, res) => {
    try {
        await deletePokemonService(req.params.id)
        res.json({ message: 'Pokemon eliminado correctamente' })
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Pokemon no encontrado' })
        }
        res.status(500).json({ error: 'Error al eliminar pokemon' })
    }
}