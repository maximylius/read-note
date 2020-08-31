const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/user');

/**
 * @route   POST api/auth
 * @desc    login user
 * @access  Public
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'Please fill in all fields.' });
  User.findOne({ email })
    .select('+password')
    .then(user => {
      if (!user) return res.status(404).json({ msg: 'User does not exists' });
      // validate password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch)
          return res.status(400).json({ msg: 'Invalid credentials' });
        jwt.sign(
          { _id: user._id },
          config.get('jwtSecret'),
          { expiresIn: 3600 },
          (err, token) => {
            console.log('err', err);
            if (err)
              return res
                .status(500)
                .json({ err, msg: 'Internal server error.' });

            res.json({
              token,
              user: user // 2do this still contains (hashed) password. How to remove that without producing an error?
            });
          }
        );
      });
    });
});

/**
 * @route   POST api/auth
 * @desc    authenticate user
 * @access  Private
 */
router.get('/user', auth, (req, res) => {
  User.findById(req.user._id)
    .select('-password')
    .then(user => res.json({ user }))
    .catch(err => res.status(400).json({ msg: err.message }));
});

module.exports = router;
