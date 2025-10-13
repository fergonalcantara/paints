import { DataTypes } from 'sequelize';
import db from '../db/db.js';

const Rol = db.define('Rol', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    tableName: 'roles',
    timestamps: false
});

export default Rol;