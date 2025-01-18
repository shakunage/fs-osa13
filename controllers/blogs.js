const router = require('express').Router()
const { Blog, User } = require('../models')
const tokenExtractor  = require('./tokenExtractor')
const { Op } = require("sequelize");


const blogFinder = async (req, res, next) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
            req.blog = blog
            next()
        } else {
            return res.status(404).json({ error: 'Blog not found' });
        }
    } catch(error) {
        next(error)
    }
  }

router.get('/', async (req, res) => {

    const search = req.query.search ? req.query.search : '';

    const blogs = await Blog.findAll({
        include: {
          model: User
        },
        where: {
            [Op.or]: [
              { title: { [Op.substring]: search } },
              { author: { [Op.substring]: search } }
            ]
        },
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['likes', 'DESC']
        ]
      })
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
        return res.json(blog)
    } catch(error) {
        next(error)
    }
})

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        req.blog.likes = req.body.likes;
        await req.blog.save();
        res.json(req.blog);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
    try {
    const user = await User.findByPk(req.decodedToken.id)
    const result = await Blog.findByPk(req.params.id)
    if (result.userId !== user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        await result.destroy()
    }
    if (result) {
        return res.status(200).json({ message: 'Blog deleted successfully' });
    } else {
        return res.status(404).json({ error: 'Blog not found' });
    }
    } catch(error) {
        next(error)
    }
})

module.exports = router