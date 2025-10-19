import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../db/db.js';
import Role from './roles.model.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 50]
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  nombre_completo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  estado: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isIn: [[0, 1, 2]]
    },
    comment: '1=activo, 0=inactivo, 2=suspendido'
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  paranoid: true,
  underscored: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password_hash) {
        const salt = await bcrypt.genSalt(10);
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password_hash = await bcrypt.hash(usuario.password_hash, salt);
      }
    }
  }
});

// Definir asociación belongsTo al Role
Usuario.belongsTo(Role, {
  foreignKey: 'rol_id',
  as: 'rol'
});

Role.hasMany(Usuario, {
  foreignKey: 'rol_id',
  as: 'usuarios'
});

// Constantes para estados
Usuario.ESTADO = {
  INACTIVO: 0,
  ACTIVO: 1,
  SUSPENDIDO: 2
};

// Método de instancia para validar password
Usuario.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

export default Usuario;