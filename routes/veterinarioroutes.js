import express from 'express';
const router = express.Router();
import { registrar, perfil, confirmar, autenticar, olvidepassword, comprobartoken, nuevopassword, actualizarperfil, actualizarpassword } from '../controllers/veterinarioController.js';
import checkauth from '../middleware/authmiddleware.js';

//Area publica
router.post('/', registrar )
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar);
router.post('/olvide-password', olvidepassword); //Verificar el correo que envia   
router.route("/olvide-password/:token").get(comprobartoken).post(nuevopassword);


//Area privada
router.get('/perfil', checkauth, perfil )
router.put('/perfil/:id', checkauth, actualizarperfil);
router.put('/actualizar-password', checkauth, actualizarpassword);

//Este router en el index.js se conoce como veterinarioroutes
export default router;