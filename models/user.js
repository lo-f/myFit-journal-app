const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  date: {
    type: Number,
    required: true,
  },
  time: Number,
  exercise: {
    type: String,
    required: true,
  },
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  workouts: [workoutSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
