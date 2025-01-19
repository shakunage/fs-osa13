const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')
// const { initializeAndLogBlogsAndUsers } = require('../models')


const sequelize = new Sequelize(process.env.DATABASE_URL);

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
  console.log(`migrations path: ${migrator.migrations.path}`)
}


const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
    await runMigrations()
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }
  // initializeAndLogBlogsAndUsers()
  return null
}

module.exports = { connectToDatabase, sequelize }