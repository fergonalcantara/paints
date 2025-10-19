import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarios.model.js';
import Role from '../models/roles.model.js';

// Login con JWT
export const login = async (req, res) => {
    try {
        const { user, password } = req.body;

        if (!user || !password) {
            return res.status(400).json({
                status: "Error",
                message: "Todos los campos son obligatorios"
            });
        }

        // Verificar usuario activo con su rol
        const userVerify = await Usuario.findOne({
            where: { 
                usuario: user, 
                estado: Usuario.ESTADO.ACTIVO 
            },
            include: [{
                model: Role,
                as: 'rol',
                attributes: ['id', 'nombre']
            }]
        });

        if (!userVerify) {
            return res.status(401).json({
                message: "Error al iniciar Sesión"
            });
        }

        // Comparar contraseña usando el método del modelo
        const passwordMatch = await userVerify.validPassword(password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Error al iniciar Sesión"
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: userVerify.id,
                usuario: userVerify.usuario, 
                rol: userVerify.rol_id,
                nombre: userVerify.nombre_completo
            },
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

        // Determinar redirección según el rol
        let redirectPath;
        if (userVerify.rol_id === 1) {
            redirectPath = "/admin";
        } else if (userVerify.rol_id === 5) {
            redirectPath = "/tienda";
        }

        return res.json({
            status: "ok",
            message: "Inicio de sesión exitoso",
            redirect: redirectPath,
            token: token
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            status: "Error",
            message: "Error interno del servidor"
        });
    }
};

// Register nuevo usuario
export const register = async (req, res) => {
    try {
        const { name, email, user, password } = req.body;

        if (!name || !email || !user || !password) {
            return res.status(400).json({ 
                status: "Error", 
                message: 'Todos los campos son obligatorios' 
            });
        }

        // Verificar si existe el email
        const usuarioExistente = await Usuario.findOne({
            where: { email }
        });

        if (usuarioExistente) {
            return res.status(400).json({ 
                message: 'El correo ya está registrado' 
            });
        }

        // Verificar si existe el username
        const userExist = await Usuario.findOne({
            where: { usuario: user }
        });

        if (userExist) {
            return res.status(400).json({ 
                message: 'El nombre de usuario ya está en uso' 
            });
        }

        // Crear usuario (el hook beforeCreate encripta automáticamente)
        const newUser = await Usuario.create({
            usuario: user,
            password_hash: password, // Se encripta automáticamente en el hook
            nombre_completo: name,
            email,
            rol_id: 5,
            estado: Usuario.ESTADO.ACTIVO
        });

        console.log('Usuario creado:', newUser.usuario);

        return res.status(201).json({
            status: "OK",
            message: "Usuario registrado correctamente",
            redirect: "/"
        });

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({
            status: "Error",
            message: "Error interno del servidor"
        });
    }
};

// Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.json({
            status: "ok",
            message: "Sesión cerrada correctamente",
            redirect: "/"
        });
    } catch (error) {
        console.error("Error en logout:", error);
        return res.status(500).json({
            status: "Error",
            message: "Error interno del servidor"
        });
    }
};