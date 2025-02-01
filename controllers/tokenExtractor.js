const jwt = require('jsonwebtoken');
const { AuthToken, Blog, User } = require('../models')

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        req.decodedToken = jwt.verify(authorization.substring(7), "your_secret_key")
        console.log(req.decodedToken.id)
        
      } catch{
        return res.status(401).json({ error: 'token invalid' })
      }
    }  else {
      return res.status(401).json({ error: 'token missing' })
    }

    const authToken = await AuthToken.findOne({
      where: {
        token: authorization.substring(7),
        revoked: false
      }
    });

    if (!authToken) {
      return res.status(401).json({ error: 'token invalid or revoked' });
    }

    next()
  }

  module.exports = tokenExtractor;