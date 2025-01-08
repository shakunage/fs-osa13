const { Model, DataTypes } = require('sequelize')
const { readFileSync } = require('fs')
const { join } = require('path')
const { sequelize } = require('../utils/db')

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const initializeAndLogBlogs = async () => {
    await Blog.sync()

    const sqlFilePath = join(__dirname, '../commands.sql');
    const sqlCommands = readFileSync(sqlFilePath, 'utf8');
    await sequelize.query(sqlCommands)

    const blogs = await Blog.findAll()
    for (const blog of blogs) {
      console.log(`${blog.author}: ${blog.title}, ${blog.url}, ${blog.likes} likes`)
    }
  }
  
initializeAndLogBlogs()

module.exports = Blog