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

    // Agregamos la Sal y hasheamos la password
    const saltRounds = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Creamos el usuario
    const nuevoUsuario = await Usuario.create({
      usuario: user,
      password_hash: hashedPassword,
      nombre_completo: name,
      email,
      rol_id: 5,
      estado: 1
    });
    console.log(nuevoUsuario);

    return res.status(201).json({
      status: "OK",
      message: "Usuario registrado correctamente",
      redirect: "/",
    });
}

export const methods = {
    login,
    register
}