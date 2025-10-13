const { DataTypes } = require('sequelize')
const db = require('../db/db')
const Rol = require('./roles.model')

const Usuario = db.define('Usuario', {
    usuario: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    nombre_completo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
}, {
    tableName: 'usuarios',
    timestamps: false
})

Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' })
module.exports = Usuario