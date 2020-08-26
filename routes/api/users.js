const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// import Models
const User = require('../../models/user');
const Text = require('../../models/text');
const Section = require('../../models/section');
const Note = require('../../models/note');

/**
 * @route   GET api/users
 * @desc    GET All Users
 * @access  DEV only
 */
router.get('/', (req, res) => {
  User.find().then(user => res.json(user));
});

/**
 * @route   POST api/users/register
 * @desc    register user
 * @access  Public
 */
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please fill in all fields.' });
  }

  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({ username, email, password });

    // create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          jwt.sign(
            { _id: user._id },
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  _id: user._id,
                  username: user.username,
                  email: user.email,
                  notebookIds: user.notebookIds,
                  textIds: user.textIds,
                  sectionIds: user.sectionIds,
                  annotationIds: user.annotationIds,
                  accessedNotebookIds: user.accessedNotebookIds,
                  accessedTextIds: user.accessedTextIds,
                  reputation: user.reputation
                }
              });
            }
          );
        });
      });
    });
  });
});

/**
 * @route   PUT api/users/update
 * @desc    update user
 * @access  Private // 2do:
 */
router.put('/update', auth, (req, res) => {
  User.findById(req.user._id)
    .then(user => {
      Object.keys(req.body).forEach(updateKey => {
        user[updateKey] = req.body[updateKey];
      });
      user.save().then(() =>
        res.json({
          success: true
        })
      );
    })
    .catch(err => res.status(404).json({ success: false, err: err }));
});

module.exports = router;
