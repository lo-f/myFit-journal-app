const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- INDEX --------------------------------- */
router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        res.render('workouts/index.ejs', {
            workouts: currentUser.workouts,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
  });

/* ----------------------------------- NEW ---------------------------------- */
router.get('/new', async (req, res) => {
    res.render('workouts/new.ejs')
})





router.get('/new/run', async (req, res) => {
    res.render('workouts/new/run.ejs')
})

router.get('/new/weightlifting', async (req, res) => {
    res.render('workouts/new/weightlifting.ejs')
})







router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.workouts.push(req.body)
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/workouts`)

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

/* ---------------------------------- SHOW ---------------------------------- */
router.get('/:workoutId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const workout = currentUser.workouts.id(req.params.workoutId)
        res.render('workouts/show.ejs', { workout: workout })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

/* --------------------------------- DELETE: -------------------------------- */
router.delete('/:workoutId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.workouts.id(req.params.workoutId).deleteOne()
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/workouts`)      
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

/* ---------------------------------- EDIT ---------------------------------- */
router.get('/:workoutId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const workout = currentUser.workouts.id(req.params.workoutId)
        res.render('workouts/edit.ejs', { workout: workout })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

module.exports = router