const express = require('express');
const router = express.Router();

// import Models
const User = require('../../models/user');
const Text = require('../../models/text');
const Section = require('../../models/section');
const Note = require('../../models/note');

/**
 * @route   GET api/notes
 * @desc    GET All Notes
 * @access  Public
 */
router.get('/', (req, res) => {
  Note.find().then(notes => res.json(notes));
});

/**
 * @route   GET api/notes/id/:id
 * @desc    GET single Note by id
 * @access
 */
router.get('/:id', (req, res) => {
  Note.find({ _id: { $in: req.params.id.split('+') } }).then(notes =>
    res.json(notes)
  );
});

/**
 * @route   GET api/notes/search/:searchfields&:searchstring
 * @desc    GET Note search results for searching string
 * @access  Public
 */
router.get('/search/:searchfields&:searchstring', (req, res) => {
  if (req.params.searchfields === 'all') {
    Note.find(
      {
        $note: {
          $search: req.params.searchstring,
          $language: 'none',
          $caseSensitive: false
        }
      },
      { score: { $meta: 'noteScore' } }
    )
      .sort({ score: { $meta: 'noteScore' } })
      .then(notes =>
        res.json(
          // return only necessary parts of notes
          notes.map(note => ({
            _id: note._id,
            title: note.title,
            author: note.author,
            publicationDate: note.publicationDate,
            keywords: note.keywords
          }))
        )
      );
  } else {
  }
});

/**
 * @route   POST api/notes
 * @desc    post a Note
 * @access  Public
 */
router.post('/', (req, res) => {
  const note = new Note({});
  Object.keys(req.body).forEach(updateKey => {
    note[updateKey] = req.body[updateKey];
  });

  note
    .save()
    .then(noteres => res.json(noteres))
    .catch(err => res.status(400).json({ err }));
});

/**
 * @route   POST api/notes/spareids/:number
 * @desc    get spare id(s)
 * @access  Public
 */
router.post('/spareids/:number', (req, res) => {
  let spareDocuments = [];
  for (let i = 0; i < Number(req.params.number); i++) {
    spareDocuments.push(new Note({ type: 'SPARE', content: '' }));
  }

  Note.collection.insertMany(spareDocuments, (err, docs) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json({ spareIds: spareDocuments.map(doc => doc._id) });
    }
  });
});

/**
 * @route   PUT api/note/vote/:id
 * @desc    update a note with a vote
 * @access  Public
 */
router.put('/vote/:id', (req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      const prevIndex = note.votes.findIndex(
        vote => vote.userId === req.body.vote.userId
      );
      if (prevIndex >= 0) {
        if (note.votes[prevIndex].bill !== req.body.vote.bill) {
          note.votes.concat(req.body.vote);
        }
        note.votes.splice(prevIndex, 1);
      } else {
        note.votes.concat(req.body.vote);
      }
      note.save().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ success: false, err: err }));
});

module.exports = router;
