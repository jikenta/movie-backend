const express = require('express');
const router = express.Router();
const axios = require('axios');
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id });
    const movieIds = favorites.map(f => f.id);

    const allRecs = [];

    for (let id of movieIds) {
      const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${TMDB_API_KEY}`;
      const tmdbRes = await axios.get(url);
      allRecs.push(...tmdbRes.data.results);
    }

    // Remove duplicates by movie ID
    const seen = new Set();
    const uniqueRecs = allRecs.filter(m => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    res.json(uniqueRecs.slice(0, 20)); // return top 20 unique recs
  } catch (err) {
    console.error('Recommendation error:', err.message);
    res.status(500).json({ msg: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
