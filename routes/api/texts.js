const express = require('express');
const router = express.Router();

// import Models
const User = require('../../models/user');
const Text = require('../../models/text');
const Section = require('../../models/section');
const Note = require('../../models/note');

/**
 * @route   GET api/texts
 * @desc    GET All Texts
 * @access  Public
 */
router.get('/', (req, res) => {
  Text.find().then(texts => res.json(texts));
});

/**
 * @route   GET api/texts/id/:id
 * @desc    GET single Text by id
 * @access  Public
 */
router.get('/id/:id', (req, res) => {
  Text.findById(req.params.id).then(texts => res.json(texts));
});

/**
 * @route   GET api/texts/id/:id
 * @desc    GET single Text by id
 * @access  Public
 */
router.get('/meta/:id', (req, res) => {
  Text.find(
    { _id: { $in: req.params.id.split('+') } },
    'title author'
  ).then(texts => res.json(texts));
});

/**
 * @route   GET api/texts/search/:searchfields&:searchstring
 * @desc    GET Text search results for searching string
 * @access  Public
 */
router.get('/search/:searchfields&:searchstring', (req, res) => {
  if (req.params.searchfields === 'all') {
    Text.find(
      {
        $text: {
          $search: req.params.searchstring,
          $language: 'none',
          $caseSensitive: false
        }
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .then(texts =>
        res.json(
          // return only necessary parts of texts
          texts.map(text => ({
            _id: text._id,
            title: text.title,
            author: text.author,
            publicationDate: text.publicationDate,
            keywords: text.keywords
          }))
        )
      );
  } else {
  }
});

/**
 * @route   POST api/texts
 * @desc    post a Text
 * @access  Public
 */
router.post('/', (req, res) => {
  const text = new Text({});
  Object.keys(req.body).forEach(updateKey => {
    text[updateKey] = req.body[updateKey];
  });

  text
    .save()
    .then(textres => res.json(textres))
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
