const express = require('express');
const router = express.Router();
const Workout = require('../models/workout.js')
const User = require('../models/user.js');
const isSignedIn = require('../middleware/is-signed-in.js');

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- INDEX --------------------------------- */
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout.find({ owner: req.session.user._id });
        res.render('workouts/index.ejs', {
            workouts,
            })
    } catch (error) {
        res.redirect('/')
    }
  });

/* ------------------------------ NEW (VIEWS) ------------------------------ */
router.get('/new', async (req, res) => {
    res.render('workouts/new.ejs')
})

/* ------------------------------- New Workout ------------------------------ */
router.post('/', async (req, res) => {
    const {
        type,
        duration,
        distance,
        notes,
        exercise,
        weight,
        sets,
        reps,
    } = req.body;
    try {
        const currentUser = await User.findById(req.session.user._id);
        if (!currentUser) {
            return res.status(404).json({error: 'User not found'})
        };
        const newWorkout = new Workout({
            type,
            duration,
            distance: type === 'run' ? parseFloat(distance) : undefined,
            exercise: type === 'weightTraining' ? (exercise) : undefined,
            weight: type === 'weightTraining' ? parseFloat(weight) : undefined,
            sets: type === 'weightTraining' ? parseFloat(sets) : undefined, 
            reps: type === 'weightTraining' ? parseFloat(reps) : undefined, 
            notes,
            owner: currentUser
          });
        await newWorkout.save();
        res.redirect(`/users/${currentUser._id}/workouts`)

    } catch (error) {
        res.redirect('/')
    }
});

/* ---------------------------------- SHOW ---------------------------------- */

router.get('/:workoutId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const workout = await Workout.findById(req.params.workoutId)
        res.render('workouts/show.ejs', { workout })
    } catch (error) {
        res.redirect('/')
    }
})

/* --------------------------------- DELETE: -------------------------------- */

router.delete('/:workoutId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        if (!currentUser) {
            return res.status(404).json({error: 'User not found'})
        };
        const workout = await Workout.findByIdAndDelete(req.params.workoutId)
        res.redirect(`/users/${currentUser._id}/workouts`)      
    } catch (error) {
        res.redirect('/')
    }
});

/* ---------------------------------- EDIT ---------------------------------- */

router.get('/:workoutId/edit', async (req, res) => {
    const { type, distance, weight, notes } = req.body;
    const workoutId = req.params.id;
    try {
        const currentUser = await User.findById(req.session.user._id);
        if (!currentUser) {
            return res.status(404).json({error: 'User not found'})
        };
        const workout = await Workout.findByIdAndUpdate(req.params.workoutId, {
            type,
            distance: type === 'run' ? parseFloat(distance) : undefined,
            weight: type === 'weightTraining' ? parseFloat(weight) : undefined,
            notes
          }, { new: true });
      
          if (!workout) {
            return res.status(404).send('Workout not found');
          }
        res.render('workouts/edit.ejs', { workout: workout })
    } catch (error) {
        res.redirect('/')
    }
});


router.put('/:workoutId', async (req, res) => {
    const { type, distance, weight, notes } = req.body;
  
    try {
    const currentUser = await User.findById(req.session.user._id);
        if (!currentUser) {
            return res.status(404).json({error: 'User not found'})
        };
    const workout = await Workout.findById(req.params.workoutId);
    workout.set(req.body)
  
      if (!workout) {
        return res.status(404).send('Workout not found!!!!!');
      }
  
      workout.type = type;
      workout.distance = type === 'run' ? parseFloat(distance) : undefined;
      workout.weight = type === 'weightTraining' ? parseFloat(weight) : undefined;
      workout.notes = notes;

      await workout.save();
  
      res.redirect(`/users/${currentUser._id}/workouts/${workout._id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating workout');
    }
  });


module.exports = router