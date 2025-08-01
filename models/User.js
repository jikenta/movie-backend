const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ratings: [
  {
    movieId: String,
    title: String,
    rating: Number,
    poster: String
  }
],
});

module.exports = mongoose.model('User', UserSchema);
