require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('../models');



// POST /auth/login route - returns a JWT
router.post('/login', (req, res) => {
  console.log('Start the POST of login')
  console.log(req.body);

  // Find out if the user is in our db (for login, you'd expect they should be)
  db.User.findOne({ email: req.body.email })
  .then(user=> {
    if (!user || !user.password) {
      return res.status(400).send('User not found')
    } 

    // User exists, great, check their auth
    // Bad Auth
    if (!user.isAuthenticated(req.body.password)) {
      // Invalid User
      return res.status(401).send('Invalid Credentials')
    }

    // Good auth, here's your token
    const token = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET_KEY, {
      expiresIn: 60 * 60 * 24 // 24 hrs in seconds
    });

    //Send that token!
    res.send({ token: token });
  })
  .catch(err =>{
    console.log(`Error in the POST /auth/login ${err}`);
    res.status(503).send('BNB 🐻 Database Error');
  });
});

// POST /auth/signup route - create a user in the DB and then give them a token so they can stay logged in
router.post('/signup', (req, res) => {
  // TODO: Debug statements: remove when no longer needed
  console.log('Start the POST of Signup')
  console.log(req.body);

  db.User.findOne({ email: req.body.email }) // FindOne just in cast someone has been messing around with our data
  .then(user => {
    if (user) {
      // if the user exists, don't let them create a dublicate account
      return res.status(409).send('User already exists');
    }
    db.User.create(req.body)
    .then(createdUser=>{
      const token = jwt.sign(createdUser.toJSON(), process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 24 // 24 hrs in seconds
      }) // SecretKey should be an env variable process.env.TOKEN_SECRET
    })
    .catch(err =>{
      console.log(`Error in the POST /auth/signup when creating new user ${err}`);
      res.status(500).send('BNB 🐻, Database Error');
    });
    
    res.send({ token: token });
  })
  .catch(err=>{
    console.log(`Error in POST /auth/signup! ${err}`);
    res.status(503).send('Bad news bears 🐻, Database Error');
  });
});

// This is what is returned when client queries for new user data
router.get('/current/user', (req, res) => {
  console.log('GET /auth/current/user STUB');

  db.User.findById(req.user.id)
  .then(user=> {
    if (!req.user || !req.user.id) {
      return res.status(401).send({ user: null })
    }
    res.send({ user: user });
  })
  .catch(err=>{
    console.log(`🐻 Error in GET /current/user! ${err}`);
    res.status(503).send({ user: null });
  });
});

module.exports = router;
