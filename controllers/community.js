const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

/* --------------------------------- LANDING -------------------------------- */

router.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        res.render('community/index.ejs', {
            users,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
  });

/* ---------------------------------- SHOW ---------------------------------- */
router.get('/:userId', async (req, res) => {
    try {
    const user = await User.findById(req.params.userId);
    res.render("community/show.ejs", { user });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})



module.exports = router;