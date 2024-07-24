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
        console.log(error);
        res.redirect('/')
    }
  });

/* ------------------------------ NEW (VIEWS) ------------------------------ */
router.get('/new', async (req, res) => {
    res.render('workouts/new.ejs')
})

/* ------------------------------- New Workout ------------------------------ */
router.post('/', async (req, res) => {
    const { type, distance, notes, weight } = req.body;
    try {
        const currentUser = await User.findById(req.session.user._id);
        if (!currentUser) {
            return res.status(404).json({error: 'User not found'})
        };
        const newWorkout = new Workout({
            type,
            distance: type === 'run' ? parseFloat(distance) : undefined,
            weight: type === 'weightTraining' ? parseFloat(weight) : undefined,
            notes,
            owner: currentUser
          });
        await newWorkout.save();
        res.redirect(`/users/${currentUser._id}/workouts`)

    } catch (error) {
        console.log(error)
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
        console.log(error)
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
        console.log(error)
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
        console.log(error)
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