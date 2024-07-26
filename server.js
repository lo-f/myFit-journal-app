const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');


/* ------------------------------- CONTROLLERS ------------------------------ */
const authController = require('./controllers/auth.js');
const communityController = require('./controllers/community.js')
const workoutsController = require('./controllers/workouts.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const quotes = require('./assets/quotes.js')

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

/* --------------------------------- ROUTES --------------------------------- */
app.get('/', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.render('index.ejs', {
    user: req.session.user,
    quote: randomQuote,    
  });
});

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/workouts', workoutsController);
app.use('/community', communityController)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
