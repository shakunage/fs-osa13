const express = require('express');
const tokenExtractor  = require('./tokenExtractor')
const { User } = require('../models');
const { ReadingList } = require('../models');
const errorHandler = require('./errorHandler');

const router = express.Router();

// POST  new reading list item
router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    // TODO: Check if blog is already in reading list
    const alreadyInList = false;

    if (!user) {
      return res.status(401).json({ message: 'Invalid user id' });
    }

    if (alreadyInList) {
      return res.status(401).json({ message: 'Blog already in reading list' });
    }

    const reading_list_item = await ReadingList.create({ blog_id: blogId, user_id: userId })
    return res.json(reading_list_item)
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

router.put('/:id', tokenExtractor, errorHandler, async (err, req, res, next) => {
  console.log(req.body.read);
  try {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid user id' });
    }

    const readingListItem = await ReadingList.findOne({ where: { id: req.params.id, user_id: user.id } });
    if (!readingListItem) {
      return res.status(404).json({ error: 'Reading list item not found' });
    }

    readingListItem.read_status = req.body.read_status;
    await readingListItem.save();
    return res.json(readingListItem);
  } catch (error) {
    next(error);
  }

});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid user id' });
    }

    const readingListItem = await ReadingList.findOne({ where: { id: req.params.id, user_id: user.id } });
    if (!readingListItem) {
      return res.status(404).json({ error: 'Reading list item not found' });
    }
    console.log(req.body.read);
    console.log(readingListItem.read_status);
    console.log(user)

    readingListItem.read_status = req.body.read;
    await readingListItem.save();
    return res.json(readingListItem);


  } catch (error) {
    next(error);
  }
})

module.exports = router;
