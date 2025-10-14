import express from "express";
import dotenv from "dotenv";
dotenv.config();

import sequelize from "./db/db.js";

// Corregimos __dirname absoluta
import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import metodos de Autenticacion
import { methods as authentication} from "./controllers/authentication.controller.js";

// Creamos nuestro Servidor
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));
console.log("Servidor corriendo en el puerto ", app.get("port"));

// Configuracion
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// Rutas definidas
app.get("/", (req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", (req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin", (req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html"));

// API
app.post("/api/register",authentication.register);
app.post("/api/login",authentication.login);

// Conexion a DB
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Base de datos conectada')
  })
}).catch(err => {
  console.error('Error al conectar la base de datos', err)
})