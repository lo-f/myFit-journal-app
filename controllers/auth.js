const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', async (req, res) => {
  res.render('auth/sign-up.ejs', { errorMessage: null});
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.render('auth/sign-up.ejs', {errorMessage: 'Username is already taken'});
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.render('auth/sign-up.ejs', {passwordError: 'Password and Confirm Password must match'})
    }
  
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
  
    await User.create(req.body);
  
    res.redirect('/auth/sign-in');
  } catch (error) {
    res.redirect('/');
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.render('auth/sign-in.ejs', {errorMessage: 'Invalid username'});
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.render('auth/sign-in.ejs', {passwordError: 'Invalid password'})
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };
  
    res.redirect('/');
  } catch (error) {
    res.redirect('/');
  }
});

module.exports = router;
