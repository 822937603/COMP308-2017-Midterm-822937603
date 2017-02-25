// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//define user models
let UserModel = require('../models/users');
let User = UserModel.User; //alias for user

// define the game model
let book = require('../models/books');

//function to check if user is authenticated
function requireAuth(req, res, next)
{
  //check if the user is Logged index
  if(!req.isAuthenticated())
  {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    books: '',
    displayName: req.user ? req.user.displayName : ''
   });
});

/* get /login - render the login view */
router.get('/login', (req, res, next) => {
  //check to see if user is already logged in
  if(!req.user) {
    // render the login page
    res.render('auth/login', {
      title: 'Login',
      games: '',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  } else {
    return res.redirect('/books'); //redirect to the books list
  }
});

// POST /login - process the login page

router.post('/login', passport.authenticate('local', {
    successRedirect: '/books',
    failureRedirect: '/login',
    failureFlash: true
}));

// GET / register - render the register page
router.get('/register', (req, res, next) => {
    // check if the user is not already logged in
    if(!req.user)
    {
      //render the registration page
      res.render('auth/register', {
        title: 'Register',
      games: '',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
      })
    }
});

//Post /register - process the register page
router.post('/register', (req, res, next) => {
  User.register(
  new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      displayName: req.body.displayName,
    }),
    req.body.password,
    (err) => {
      if(err)
      {
        console.log('error inserting new user');
        if(err.name == 'UserExistsError')
        {
          req.flash('registerMessage', 'Registration Error: User already exists!');
        }
        return res.render('auth/register', {
          title: 'Register',
          games: '',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });

      }
      // if registration is successful
      return passport.authenticate('local')(req, res, ()=> {
        res.redirect('/books');
      });

      });
});

//Get /logout - Logout the user and redirect to the homepage
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); //redirect to homepage
});

module.exports = router;
