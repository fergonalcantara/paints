import express from 'express';
import * as usuariosController from '../controllers/usuarios.controller.js';

const router = express.Router();

router.post('/', usuariosController.create);
router.get('/', usuariosController.getAll);
router.get('/deleted', usuariosController.getDeleted);
router.get('/:id', usuariosController.getById);
router.put('/:id', usuariosController.update);
router.patch('/:id/password', usuariosController.changePassword);
router.patch('/:id/status', usuariosController.changeStatus);
router.delete('/:id', usuariosController.deleteUsuario);
router.delete('/:id/force', usuariosController.forceDelete);
router.post('/:id/restore', usuariosController.restore);

export default router;