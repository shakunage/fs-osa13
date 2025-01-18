const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../utils/db')

router.get('/', async (req, res) => {

    try {
        console.log('Fetching authors...');
        const authors = await Blog.findAll({
          attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('id')), 'blogCount'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'totalLikes']
          ],
          group: ['author'],
          order: [
            [sequelize.fn('SUM', sequelize.col('likes')), 'DESC']
          ]
        });
    
        res.json(authors);
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
      }
})


module.exports = router