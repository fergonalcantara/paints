import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 30]
    }
  },
  estado: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isIn: [[0, 1, 2]] // 0=inactivo, 1=activo, 2=suspendido
    },
    comment: '0=inactivo, 1=activo, 2=suspendido'
  }
}, {
  tableName: 'roles',
  timestamps: true,
  paranoid: true,
  underscored: false
});

// Constantes para facilitar el uso
Role.ESTADO = {
  INACTIVO: 0,
  ACTIVO: 1,
  SUSPENDIDO: 2
};

export default Role;