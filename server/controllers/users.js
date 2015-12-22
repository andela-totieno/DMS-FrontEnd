(function() {
  'use strict';
  var User = require('../models/user');
  var Document = require('../models/document');
  var jwt = require('jsonwebtoken');
  var superSecret = 'teddyotienoasoladms';

  module.exports = {

    // Signs Up a User
    signup: function(req, res) {
      var user = new User();
      user.name.first = req.body.firstname;
      user.name.second = req.body.secondname;
      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      user.title = req.body.title;

      user.save(function(err) {
        if (err) {
          if (err.code === 1000) {
            console.log(res.status);
            return res.status(500).json({
              message: 'A user with that name already exists'
            });
          } else {
            return res.status(500).send(err);
          }
        }
        res.json({
          message: 'User successfully created'
        });
      });

    },

    // Logout a User and deletes the assigned token
    logout: function(req, res) {
      delete req.headers['x-access-token'];
      return res.status(200).json({
        message: 'User has been successfully logged out'
      });
    },

    // Logs In a User by verifying his username and password
    login: function(req, res) {
      // Find the User
      // Select the name and password explicitly
      User.findOne({
        username: req.body.username
      }).exec(function(err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          res.json({
            success: false,
            message: 'Authentication failed. User not found'
          });
        } else if (user) {
          // Check if password matches
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({
              success: false,
              message: 'Authentication failed. Wrong password'
            });
          } else {
            // If user is found and password is right
            var token = jwt.sign(user, superSecret, {
              expiresIn: 10800
            });

            res.json({
              success: true,
              message: 'User successfully logged in',
              token: token,
              user: user
            });
          }
        }
      });
    },

    // Returns all the Documents of a specified user
    getAllDocumentsByUser: function(req, res) {
      Document.find({
          ownerId: req.params.ownerId
        })
        .populate('ownerId')
        .exec(function(err, docs) {
          if (err) {
            return err;
          } else {
            return res.status(200).json({
              documents: docs
            });
          }
        });
    },

    // Returns all the users stored in the DB
    getAllUsers: function(req, res) {
      User.find(function(err, users) {
        if (err) {
          res.send(err);
        }
        res.json({
          users: users
        });
      });
    },

    // Finds the user based on his id.
    find: function(req, res) {
      User.findById(req.params.id, function(err, user) {
        if (err) {
          res.send(err);
        }
        res.json(user);
      });
    },

    // Updates the User details with any updated information
    update: function(req, res) {
      User.findById(req.params.id, function(err, user) {
        if (err) {
          res.send(err);
        }

        // Update the User Information only if its new
        if (req.body.firstname) {
          user.name.first = req.body.firstname;
        }
        if (req.body.secondname) {
          user.name.second = req.body.secondname;
        }
        if (req.body.username) {
          user.username = req.body.username;
        }
        if (req.body.password) {
          user.password = req.body.password;
        }
        if (req.body.email) {
          user.email = req.body.email;
        }

        // Save the user
        user.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.json({
            message: 'User successfully updated'
          });
        });
      });
    },

    // Deletes the User
    delete: function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err) {
        if (err) {
          res.send(err);
        }
        res.json({
          message: 'User successfully deleted!'
        });
      });
    }
  };
}());