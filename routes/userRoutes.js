const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Assuming auth is your JWT middleware

const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Watchlist = require('../models/Watchlist');

// @route   POST /api/user/rate
// @desc    Rate a movie
// @access  Private
router.post('/rate', auth, async (req, res) => {
  const { movieId, title, rating, poster } = req.body;

  if (!movieId || !title || !poster || !rating) {
    return res.status(400).json({ msg: 'All fields are required.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update existing or push new rating
    const existing = user.ratings.find((r) => r.movieId === movieId);
    if (existing) {
      existing.rating = rating;
    } else {
      user.ratings.push({ movieId, title, rating, poster });
    }

    await user.save();
    res.json({ msg: 'Rating saved successfully' });
  } catch (err) {
    console.error('Rating Error:', err.message);
    res.status(500).send('Server error');
  }
});


router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const favorites = await Favorite.find({ userId: req.user.id });
    const watchlist = await Watchlist.find({ userId: req.user.id });

    res.json({ user, favorites, watchlist });
  } catch (err) {
    console.error('Profile Fetch Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
