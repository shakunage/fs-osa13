const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Must be a valid email address'
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user',
  defaultScope: {
    attributes: { disabled: false }
  }
})

module.exports = User