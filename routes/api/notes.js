const express = require('express');
const router = express.Router();

// Notes Model
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
 * @route   GET api/notes/:id
 * @desc    GET specific Notes
 * @access  Public
 */
router.get('/:id', (req, res) => {
  Note.find({
    _id: { $in: req.params.id.split('+') }
  }).then(notes => res.json(notes));
});

/**
 * @route   POST api/notes
 * @desc    create a note
 * @access  Public
 */
router.post('/', (req, res) => {
  const newNote = new Note({
    type: req.body.type,
    content: req.body.content,
    editedBy: [] //2do current user
  });

  newNote
    .save()
    .then(note => {
      res.json({ _id: note._id });
    })
    .catch(res => res.status(400).json({ success: false }));
});

/**
 * @route   POST api/notes/spareids/:number
 * @desc    get spare id(s)
 * @access  Public
 */
router.post('/spareids/:number', (req, res) => {
  let spareDocuments = [];
  for (let i = 0; i < Number(req.params.number); i++) {
    spareDocuments.push(new Note({ type: 'SPARE', textcontent: '' }));
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
 * @route   PUT api/notes/:id
 * @desc    update a note
 * @access  Public
 */
router.put('/:id', (req, res) => {
  Note.findById(req.params.id)
    .then(note => {
      Object.keys(req.body).forEach(updateKey => {
        note[updateKey] = req.body[updateKey];
      });
      note.save().then(() =>
        res.json({
          success: true
        })
      );
    })
    .catch(err => res.status(404).json({ success: false, err: err }));
});

/**
 * @route   DELETE api/notes/:id
 * @desc    delete one note or many notes
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  // split at + to detect if multiple
  const noteIds = req.params.id.split('+');
  if (noteIds.length === 1) {
    // single delete
    Note.findById(noteIds[0])
      .then(note => note.remove().then(() => res.json({ success: true })))
      .catch(err => res.status(404).json({ success: false, err }));
  } else {
    // delete many
    Note.deleteMany({ _id: { $in: noteIds } }, (err, result) => {
      if (err) {
        res.status(400).json({ err });
      } else {
        res.json(result.n);
      }
    });
  }
});

/**
 * @route   DELETE api/notes/spareids/:minutestoexpire
 * @desc    delete one note or many notes
 * @access  Public
 */
router.delete('/spareids/:minutestoexpire', (req, res) => {
  Note.deleteMany({ $and: [{ editedBy: { $size: 0 } }] }, (err, result) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json(result.n);
    }
  });
});

module.exports = router;
