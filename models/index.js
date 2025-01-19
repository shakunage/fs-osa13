const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list_item')
const { readFileSync } = require('fs')
const { join } = require('path')
const { sequelize } = require('../utils/db')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingList, as: 'readingListBlogs', foreignKey: 'blog_id' });
User.belongsToMany(Blog, { through: ReadingList, as: 'readingList', foreignKey: 'user_id' });

const initializeAndLogBlogsAndUsers = async () => {
  const sqlFilePath = join(__dirname, '../commands.sql');
  const sqlCommands = readFileSync(sqlFilePath, 'utf8');
  await sequelize.query(sqlCommands)
  const blogs = await Blog.findAll()
  for (const blog of blogs) {
    console.log(`${blog.author}: ${blog.title}, ${blog.url}, ${blog.likes} likes`)
  }

  const users = await User.findAll()
    for (const user of users) {
      console.log(`${user.name}`)
    }
}
  
// initializeAndLogBlogsAndUsers()

module.exports = {
    Blog,
    ReadingList,
    User,
    initializeAndLogBlogsAndUsers
}