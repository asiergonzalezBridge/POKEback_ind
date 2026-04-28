import UserPokemon from "../models/userPokemonModel.js";

// Obtiene todos los Pokémon que pertenecen a un usuario.
export const getUserPokemons = async (id) => {
    return await UserPokemon.findAll({
        where: { user_id_user: id }
    });
};
