const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('reading_lists', 'created_at', {
      type: DataTypes.DATE, 
      allowNull: false,
      defaultValue: new Date()
    }),
    await queryInterface.addColumn('reading_lists', 'updated_at', {
      type: DataTypes.DATE, 
      allowNull: false,
      defaultValue: new Date()
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('reading_lists', 'created_at')
    await queryInterface.removeColumn('reading_lists', 'updated_at')
  },
}