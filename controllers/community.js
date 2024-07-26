const express = require('express');
const router = express.Router();
const Workout = require('../models/workout.js')
const User = require('../models/user.js');

/* ------------------------------- USERS INDEX ------------------------------ */

router.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        res.render('community/index.ejs', {
            users,
        })
    } catch (error) {
        res.redirect('/')
    }
  });

/* ------------------------------ USER WORKOUTS ----------------------------- */

router.get('/:userId', async (req, res) => {
    try {
        const workouts = await Workout.find({owner: req.params.userId});
        const user = await User.findById(req.params.userId)
        res.render('community/userWorkouts.ejs', {
            workouts, user
        })
    } catch (error) {
        res.redirect('/')
    }
});

/* ---------------------------------- SHOW ---------------------------------- */

router.get('/:userId/:workoutId', async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.workoutId,
            owner: req.params.userId
        });
        const user = await User.findById({
            _id: req.params.userId
        })
        if(!workout) {
            return res.status(404).send('Workout not found')
        };
        res.render('community/show.ejs', { workout, user });
    } catch (error) {
        res.redirect('/');
    }
});


module.exports = router;