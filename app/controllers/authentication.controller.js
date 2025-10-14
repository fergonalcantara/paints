import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarios.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Inicio de Sesion - Verificamos credenciales
async function login(req, res) {

}

// Registrar - Registramos un nuevo usuario
async function register(req, res) {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const user = req.body.user;
    const password = req.body.password;
    if (!name || !email || !user || !password) {
        return res.status(400).send({ status: "Error", message: 'Todos los campos son obligatorios' });
    }

    // Verificamos si ya existe el usuario o el correo
    const usuarioExistente = await Usuario.findOne({
        where: { email }
    });

    if (usuarioExistente) {
        return res.status(400).send({ message: 'El correo ya está registrado' });
    }

    const userExist = await Usuario.findOne({
        where: { usuario: user }
    });

    if (userExist) {
        return res.status(400).send({ message: 'El nombre de usuario ya está en uso' });
    }
}

export const methods = {
    login,
    register
}