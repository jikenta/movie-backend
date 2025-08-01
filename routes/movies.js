const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains user id
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

// Save to Favorites
router.post('/favorites', authenticate, async (req, res) => {
  const { id, title, poster_path, release_date } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const exists = user.favorites.some(movie => movie.id === id);
    if (!exists) {
      user.favorites.push({ id, title, poster_path, release_date });
      await user.save();
    }
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get Favorites
router.get('/favorites', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.favorites);
});

// Remove Favorite
router.delete('/favorites/:id', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter(movie => movie.id !== req.params.id);
  await user.save();
  res.json(user.favorites);
});

// Repeat same pattern for Watchlist

router.post('/watchlist', authenticate, async (req, res) => {
  const { id, title, poster_path, release_date } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const exists = user.watchlist.some(movie => movie.id === id);
    if (!exists) {
      user.watchlist.push({ id, title, poster_path, release_date });
      await user.save();
    }
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/watchlist', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.watchlist);
});

router.delete('/watchlist/:id', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.watchlist = user.watchlist.filter(movie => movie.id !== req.params.id);
  await user.save();
  res.json(user.watchlist);
});

module.exports = router;
