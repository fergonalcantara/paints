import Role from '../models/roles.model.js';
import { Op } from 'sequelize';

// Crear rol
export const create = async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    const role = await Role.create({ 
      nombre, 
      estado: estado || Role.ESTADO.ACTIVO 
    });
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Obtener todos (sin los eliminados)
export const getAll = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: { estado: Role.ESTADO.ACTIVO }
    });
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener por ID
export const getById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar rol
export const update = async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    await role.update({ nombre, estado });
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cambiar estado del rol
export const changeStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    await role.update({ estado });
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete lógico (soft delete)
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    
    if (!role) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    await role.destroy();
    res.json({ success: true, message: 'Rol eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete físico (opcional)
export const forceDelete = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, { paranoid: false });
    
    if (!role) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    await role.destroy({ force: true });
    res.json({ success: true, message: 'Rol eliminado permanentemente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Restaurar rol eliminado
export const restore = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, { paranoid: false });
    
    if (!role) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    await role.restore();
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ver roles eliminados
export const getDeleted = async (req, res) => {
  try {
    const roles = await Role.findAll({ 
      paranoid: false,
      where: { deletedAt: { [Op.ne]: null } }
    });
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};