import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarios.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Inicio de Sesion - Verificamos credenciales
async function login(req, res) {
    try {
        const { user, password } = req.body;

        if (!user || !password) {
            return res.status(400).json({
                status: "Error",
                message: "Todos los campos son obligatorios"
            });
        }

        // Verificar que el usuario exista y esté activo
        const userVerify = await Usuario.findOne({
            where: { usuario: user, estado: 1 }
        });

        if (!userVerify) {
            return res.status(401).json({
                message: "Error al iniciar Sesión"
            });
        }

        // Comparar contraseña
        const passwordMatch = await bcrypt.compare(password, userVerify.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Error al iniciar Sesión"
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { usuario: userVerify.usuario, rol: userVerify.rol_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        // Configurar cookie
        const cookieOptions = {
            maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: "/"
        };

        res.cookie("jwt", token, cookieOptions);

        // Determinamos la redirección según el rol
        let redirectPath;
        if (userVerify.rol_id === 1) {
            redirectPath = "/admin";
        } else if (userVerify.rol_id === 5) {
            redirectPath = "/tienda";
        }

        return res.json({
            status: "ok",
            message: "Inicio de sesión exitoso",
            redirect: redirectPath
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            status: "Error",
            message: "Error interno del servidor"
        });
    }
}

// Registrar - Registramos un nuevo usuario
async function register(req, res) {
    try {
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
        const newUser = await Usuario.create({
            usuario: user,
            password_hash: hashedPassword,
            nombre_completo: name,
            email,
            rol_id: 5,
            estado: 1
        });
        console.log(newUser);

        return res.status(201).json({
            status: "OK",
            message: "Usuario registrado correctamente",
            redirect: "/",
        });
    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({
            status: "Error",
            message: "Error interno del servidor"
        });
    }
}

export const methods = {
    login,
    register
}