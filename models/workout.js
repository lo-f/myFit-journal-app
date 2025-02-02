const mongoose = require('mongoose');


const workoutSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['run', 'weightTraining', 'walk'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  duration: Number,
  distance: {
    type: Number,
    required: function() {
      return this.type === 'run';
    }
  },
  exercise: {
    type: String,
    required: function () {
      return this.type === 'weightTraining';
    }
  },
  weight: {
    type: Number,
    required: function() {
      return this.type === 'weightTraining';
    }
  },
  sets: {
    type: Number,
    required: function () {
      return this.type === 'weightTraining';
    }
  },
  reps: {
    type: Number,
    required: function() {
      return this.type === 'weightTraining';
    }
  },
  notes: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Workout = mongoose.model('Workout', workoutSchema)

module.exports = Workout;
