import { UserPokemon, Pokemon } from '../models/index.js'

// Obtiene todos los Pokémon que pertenecen a un usuario.
export const getUserPokemons = async (id) => {
    return await UserPokemon.findAll({
        where: { user_id_user: id },
        include: {
            model: Pokemon
        }
    });
};
