const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const getUserId = require('../../middleware/getUserId');

// User Model
const User = require('../../models/user');
const Project = require('../../models/project');

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
        Promise.all(
          user.projectIds.map(projectId => Project.findById(projectId)) // append user projects
        ).then(projects => {
          jwt.sign(
            { _id: user._id },
            config.get('jwtSecret'),
            { expiresIn: 36000 },
            (err, token) => {
              if (err)
                return res
                  .status(500)
                  .json({ err, msg: 'Internal server error.' });

              res.json({
                token,
                projects,
                user: user // 2do this still contains (hashed) password. How to remove that without producing an error?
              });
            }
          );
        });
      });
    });
});

/**
 * @route   POST api/auth
 * @desc    authenticate user
 * @access  Private
 */
router.get('/user', getUserId, (req, res) => {
  User.findById(req.userId)
    // .select('-email') // check security
    .then(user => {
      Promise.all(
        user.projectIds.map(projectId => Project.findById(projectId)) // append user projects
      ).then(projects => {
        console.log('projects', projects);
        res.json({ user, projects });
      });
    })
    .catch(err => res.status(400).json({ msg: err.message }));
});

module.exports = router;
