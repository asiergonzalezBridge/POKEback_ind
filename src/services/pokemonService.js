import Pokemon from "../models/pokemonModel.js";

// Obtiene todos los Pokémon del catálogo.
export const getAllPokemonsService = async () => {
    return await Pokemon.findAll();
};

// Obtiene un Pokémon del catálogo por su ID.
export const getPokemonByIdService = async (id) => {
    const pokemon = await Pokemon.findByPk(id);
    if (!pokemon) throw new Error('NOT_FOUND');
    return pokemon;
};

// Añade un nuevo Pokémon al catálogo.
export const createPokemonService = async (data) => {
    return await Pokemon.create(data);
};

// Actualiza los datos de un Pokémon del catálogo.
export const updatePokemonService = async (id, data) => {
    const pokemon = await Pokemon.findByPk(id);
    if (!pokemon) throw new Error('NOT_FOUND');
    return await pokemon.update(data);
};

// Elimina un Pokémon del catálogo.
export const deletePokemonService = async (id) => {
    const pokemon = await Pokemon.findByPk(id);
    if (!pokemon) throw new Error('NOT_FOUND');
    return await pokemon.destroy();
};
