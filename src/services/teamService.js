import Team from "../models/teamModel.js";
import TeamPokemon from "../models/teamPokemonModel.js";
import UserPokemon from "../models/userPokemonModel.js";
import User from "../models/userModel.js";

// Obtiene todos los equipos de la base de datos.
export const getAllTeam = async () => {
    return await Team.findAll();
};

// Obtiene los equipos completos de un usuario, incluyendo los Pokémon de cada slot.
export const getFullTeam = async (id) => {
    return await Team.findAll({
        where: { id_user: id },
        include: {
            model: TeamPokemon,
            include: {
                model: UserPokemon
            }
        }
    });
};

// Elimina un Pokémon de un slot concreto de un equipo.
export const removePokemonFromTeam = async (team_id, slot) => {
    return await TeamPokemon.destroy({
        where: { team_id, slot }
    });
};

// Crea un equipo con sus Pokémon asignados por slot.
export const createTeam = async ({ user_id, name, pokemons }) => {

    const user = await User.findByPk(user_id);
    if (!user) throw new Error("El usuario no existe");

    if (!pokemons || pokemons.length === 0 || pokemons.length > 6) {
        throw new Error("Un equipo debe tener entre 1 y 6 pokémon");
    }

    // Verifica que todos los Pokémon pertenezcan al usuario
    const userPokemons = await UserPokemon.findAll({
        where: {
            id_user_pokemon: pokemons,
            user_id_user: user_id
        }
    });

    if (userPokemons.length !== pokemons.length) {
        throw new Error("Algún Pokémon no pertenece al usuario");
    }

    const team = await Team.create({ id_user: user_id, name });

    const teamPokemonsData = pokemons.map((pokeId, index) => ({
        team_id: team.id_team,
        user_pokemon_id: pokeId,
        slot: index + 1
    }));

    await TeamPokemon.bulkCreate(teamPokemonsData);

    return team;
};
