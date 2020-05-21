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
  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ msg: 'User does not exists' });
    // validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
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
