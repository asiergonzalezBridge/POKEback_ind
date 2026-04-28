import * as TeamService from "../services/teamService.js";

// GET teams
export const getAllTeams = async (req, res) => {
    try {
        const teams = await TeamService.getAllTeam();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET team
export const getTeamsByUser = async (req, res) => {
    try {
        const teams = await TeamService.getFullTeam(req.params.id); // 🔥 cambiado
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE team
export const createTeam = async (req, res) => {
    try {
        const { user_id, name, pokemons } = req.body; // ✔ lo dejamos igual

        const team = await TeamService.createTeam({
            user_id,
            name,
            pokemons
        });

        res.status(201).json(team);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE team
export const deleteTeam = async (req, res) => {
    try {
        await TeamService.deleteTeam(req.params.id);
        res.json({ message: "Equipo eliminado" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};