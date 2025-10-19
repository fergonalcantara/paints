import Usuario from '../models/usuarios.model.js';
import Role from '../models/roles.model.js';
import { Op } from 'sequelize';

// Crear usuario (para admin)
export const create = async (req, res) => {
  try {
    const { usuario, password_hash, nombre_completo, email, rol_id, estado } = req.body;
    
    const nuevoUsuario = await Usuario.create({
      usuario,
      password_hash,
      nombre_completo,
      email,
      rol_id: rol_id || 5,
      estado: estado || Usuario.ESTADO.ACTIVO
    });

    const usuarioResponse = nuevoUsuario.toJSON();
    delete usuarioResponse.password_hash;

    res.status(201).json({ success: true, data: usuarioResponse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { estado: Usuario.ESTADO.ACTIVO },
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre', 'estado']
      }],
      attributes: { exclude: ['password_hash'] }
    });
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre', 'estado']
      }],
      attributes: { exclude: ['password_hash'] }
    });

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { usuario: username, nombre_completo, email, rol_id, estado } = req.body;
    const usuarioDb = await Usuario.findByPk(req.params.id);

    if (!usuarioDb) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    await usuarioDb.update({
      usuario: username,
      nombre_completo,
      email,
      rol_id,
      estado
    });

    const usuarioResponse = usuarioDb.toJSON();
    delete usuarioResponse.password_hash;

    res.json({ success: true, data: usuarioResponse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password_actual, password_nueva } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const isValidPassword = await usuario.validPassword(password_actual);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
    }

    await usuario.update({ password_hash: password_nueva });
    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    await usuario.update({ estado });

    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.password_hash;

    res.json({ success: true, data: usuarioResponse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forceDelete = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { paranoid: false });

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    await usuario.destroy({ force: true });
    res.json({ success: true, message: 'Usuario eliminado permanentemente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restore = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { paranoid: false });

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    await usuario.restore();

    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.password_hash;

    res.json({ success: true, data: usuarioResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeleted = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      paranoid: false,
      where: { deletedAt: { [Op.ne]: null } },
      include: [{
        model: Role,
        as: 'rol',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['password_hash'] }
    });
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};