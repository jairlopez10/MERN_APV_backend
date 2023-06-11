import express from "express";
import { agregarpaciente, obtenerpacientes, obtenerpaciente, actualizarpaciente, eliminarpaciente } from "../controllers/pacientecontroller.js";
import checkauth from "../middleware/authmiddleware.js";

const router = express.Router();

router.route('/').post(checkauth, agregarpaciente).get(checkauth, obtenerpacientes);
router.route('/:id').get(checkauth, obtenerpaciente).put(checkauth, actualizarpaciente).delete(checkauth, eliminarpaciente);


export default router;