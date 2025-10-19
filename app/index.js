import express from "express";
import dotenv from "dotenv";
import sequelize from "./db/db.js";
dotenv.config();

// Corregimos __dirname absoluta
import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Imports Controllers
import authRoutes from './routes/authentication.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

// Creamos nuestro Servidor
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en el puerto ", app.get("port"));

// Configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use('/api', authRoutes);

// Rutas definidas
app.get("/", (req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", (req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin", (req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html"));
app.get("/ventas", (req,res)=> res.sendFile(__dirname + "/pages/admin/ventas.html"));

// API
app.use('/api/roles', rolesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Conexion a DB
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Base de datos conectada')
  })
}).catch(err => {
  console.error('Error al conectar la base de datos', err)
})