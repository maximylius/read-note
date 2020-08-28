const express = require('express');
const router = express.Router();

// import Models
const User = require('../../models/user');
const Text = require('../../models/text');
const Section = require('../../models/section');
const Note = require('../../models/note');

/**
 * @route   GET api/sections
 * @desc    GET All Sections
 * @access  Public
 */
router.get('/', (req, res) => {
  Section.find()
    .sort({ textId: -1 })
    .sort({ firstWordIndex: -1 })
    .sort({ lastWordIndex: -1 })
    .then(sections => res.json(sections));
});

/**
 * @route   GET api/sections/:id
 * @desc    GET specific Sections
 * @access  Public
 */
router.get('/:id', (req, res) => {
  Section.find({ _id: { $in: req.params.id.split('+') } }).then(sections =>
    res.json(sections)
  );
});

/**
 * @route   POST api/sections
 * @desc    create a section
 * @access  Public
 */

router.post('/', (req, res) => {
  const section = new Section({});

  Object.keys(req.body).forEach(updateKey => {
    section[updateKey] = req.body[updateKey];
  });

  section
    .save()
    .then(section => {
      res.json({ _id: section._id });
    })
    .catch(res => res.status(400).json({ success: false }));
});

/**
 * @route   POST api/sections/spareids/:number
 * @desc    get spare id(s)
 * @access  Public
 */
router.post('/spareids/:number', (req, res) => {
  let spareDocuments = [];
  for (let i = 0; i < Number(req.params.number); i++) {
    spareDocuments.push(new Section({ type: 'SPARE', content: '' }));
  }

  Section.collection.insertMany(spareDocuments, (err, docs) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json({ spareIds: spareDocuments.map(doc => doc._id) });
    }
  });
});

/**
 * @route   DELETE api/sections/spareids/:minutestoexpire
 * @desc    delete one section or many sections
 * @access  Public
 */
router.delete('/spareids/:minutestoexpire', (req, res) => {
  Section.deleteMany({ $and: [{ editedBy: { $size: 0 } }] }, (err, result) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json(result.n);
    }
  });
});
module.exports = router;
