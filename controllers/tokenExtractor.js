const jwt = require('jsonwebtoken');

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    console.log(authorization)
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), "your_secret_key")
      } catch{
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }

  module.exports = tokenExtractor;