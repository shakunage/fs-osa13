const router = require('express').Router()
const { Blog } = require('../models')

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
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.post('/', async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body)
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

router.delete('/:id', blogFinder, async (req, res, next) => {
    try {
    const result = await req.blog.destroy()
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