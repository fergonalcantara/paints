import express from 'express';
import * as rolesController from '../controllers/roles.controller.js';

const router = express.Router();

router.post('/', rolesController.create);
router.get('/', rolesController.getAll);
router.get('/deleted', rolesController.getDeleted);
router.get('/:id', rolesController.getById);
router.put('/:id', rolesController.update);
router.patch('/:id/status', rolesController.changeStatus);
router.delete('/:id', rolesController.deleteRole);
router.delete('/:id/force', rolesController.forceDelete);
router.post('/:id/restore', rolesController.restore);

export default router;
