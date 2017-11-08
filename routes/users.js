var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


// Register
router.get('/register', (request, response) => {
    response.render('register');
});

// Login
router.get('/login', (request, response) => {
    response.render('login');
});


// Register User
router.post('/register', (request, response) => {
    var name = request.body.name;
    var email = request.body.email;
    var username = request.body.username;
    var password = request.body.password;
    var password2 = request.body.password2;

    // Validation
    request.checkBody('name', 'Name is required').notEmpty();
    request.checkBody('email', 'Email is required').notEmpty();
    request.checkBody('email', 'It is not an email').isEmail();
    request.checkBody('username', 'Username is required').notEmpty();
    request.checkBody('password', 'Password is required').notEmpty();
    request.checkBody('password2', 'Password do not match').equals(request.body.password);

    var errors = request.validationErrors();

    if (errors) {
        response.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, (err, user) => {
            if (err)
                throw err;
            console.log(user);

        });
        request.flash('success_msg', 'You are registered and can now login');

        response.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) {
                throw err;
            } else if (!user) {
                return done(null, false, {
                    message: 'Unknow User'
                });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) {
                    throw err;
                } else if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/');
    });




    router.get('/logout', (request, response)=>{
    request.logout();
    
    request.flash('succes_msg', 'You are logged out');

    response.redirect('/users/login');
});

module.exports = router;

