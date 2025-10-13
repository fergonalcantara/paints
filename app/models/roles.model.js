const { DataTypes } = require('sequelize')
const db = require('../db/db')

const Rol = db.define('Rol', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    tableName: 'roles',
    timestamps: false
})

module.exports = Rol