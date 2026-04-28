import { Router } from "express";
import * as teamController from "../controllers/teamController.js";

const router = Router();

// GET todos los equipos
router.get("/", teamController.getAllTeams);

// GET equipos de un usuario
router.get("/user/:id", teamController.getTeamsByUser);

// CREATE equipo
router.post("/", teamController.createTeam);

// DELETE equipo
router.delete("/:id", teamController.deleteTeam);

export default router;