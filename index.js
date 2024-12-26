require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false
    // }
  },
});

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


const sqlFilePath = path.join(__dirname, 'commands.sql')
const sqlCommands = fs.readFileSync(sqlFilePath, 'utf8')

sequelize.query(sqlCommands)
  .then(() => {
    console.log('SQL commands executed successfully')
  })
  .catch(err => {
    console.error('Error executing SQL commands:', err)
  })

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
    try {
      const blog = await Blog.create(req.body)
      return res.json(blog)
    } catch(error) {
      return res.status(400).json({ error })
    }
})

app.delete('/api/blogs/:id', async (req, res) => {
  console.log("req params id is: ", req.params.id)
    try {
      const result = await Blog.destroy({
        where: {
          id: req.params.id
        },
      });
      if (result) {
        return res.status(200).json({ message: 'Blog deleted successfully' });
      } else {
        return res.status(404).json({ error: 'Blog not found' });
      }
    } catch(error) {
      return res.status(400).json({ error })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const logBlogs = async () => {
  const blogs = await Blog.findAll()
  for (const blog of blogs) {
    console.log(`${blog.author}: ${blog.title}, ${blog.url}, ${blog.likes} likes`)
  }
}

logBlogs()