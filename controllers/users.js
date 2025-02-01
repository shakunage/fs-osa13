const router = require('express').Router()
const { AuthToken, Blog, User } = require('../models')
const tokenExtractor  = require('./tokenExtractor')

const userFinder = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username
            }
        });
        if (user) {
            req.user = user
            next()
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch(error) {
        next(error)
    }
  }

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [
            {
              model: Blog
            },
            {
              model: Blog,
              as: 'readingList',
              through: {
                attributes: ['id', 'read_status']
              }
            }
          ]
      })
    res.json(users)
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        return res.json(user)
    } catch(error) {
        next(error)
    }
})

router.put('/:username', userFinder, async (req, res, next) => {
    try {
        req.user.username = req.body.username;
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        next(error);
    }
})

router.get('/:id', async (req, res) => {
    const readStatus = req.query.read === 'true' ? true : req.query.read === 'false' ? false : null;
    const users = await User.findOne({
        where: {
            id: req.params.id
        },
        include: [
            // {
            //   model: Blog
            // },
            {
              model: Blog,
              as: 'readingList',
              through: {
                attributes: ['id', 'read_status'],
                where: readStatus !== null ? { read_status: readStatus } : {}
              },
            }
          ],
          attributes: [], // Exclude other user attribute
      })

    res.json(users)
})

// TODO: modify tokenExtractor to check for token in database
// modify login route and tokenExtractor so that disabled users cannot perform actions that require login

router.delete('/logout', tokenExtractor, async (req, res) => {
    
    try {
        await AuthToken.update(
          { revoked: true },
          { where: { revoked: false } } // Only update tokens that are not already revoked
        );
        res.status(200).json({ message: 'Logged out successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
})

module.exports = router