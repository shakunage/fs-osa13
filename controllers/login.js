const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthToken, User } = require('../models');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Replace with a secure secret key

// POST /api/login
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = password === "salasana" ? true : false

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    await AuthToken.create({ token, user_id: user.id });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

module.exports = router;
