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

/**
 * @route   PUT api/text/:id
 * @desc    update a text
 * @access  Public
 */
router.put('/:id', (req, res) => {
  Text.findById(req.params.id)
    .then(text => {
      Object.keys(req.body).forEach(updateKey => {
        text[updateKey] = req.body[updateKey];
      });
      console.log(2000);
      text.save().then(() =>
        res.json({
          success: true
        })
      );
    })
    .catch(err => {
      console.log('Error in update text:', err);
      res.status(404).json({ success: false, err: err });
    });
});

/**
 * @route   POST api/text/spareids/:number
 * @desc    get spare id(s)
 * @access  Public
 */
router.post('/spareids/:number', (req, res) => {
  let spareDocuments = [];
  for (let i = 0; i < Number(req.params.number); i++) {
    spareDocuments.push(new Text({ type: 'SPARE', content: '' }));
  }

  Text.collection.insertMany(spareDocuments, (err, docs) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json({ spareIds: spareDocuments.map(doc => doc._id) });
    }
  });
});

/**
 * @route   DELETE api/texts/spareids/:minutestoexpire
 * @desc    delete one text or many texts
 * @access  Public
 */
router.delete('/spareids/:minutestoexpire', (req, res) => {
  Text.deleteMany({ $and: [{ editedBy: { $size: 0 } }] }, (err, result) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json(result.n);
    }
  });
});

module.exports = router;
