import * as userPokemonService from "../services/userPokemonService.js";

export const getUserPokemons = async (req, res, next) => {
    try {
        const pokemons = await userPokemonService.getUserPokemons(req.params.id);
        res.json(pokemons);
    } catch (error) {
        next(error);
    }
};