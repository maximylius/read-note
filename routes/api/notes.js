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
 * @route   PUT api/note/:id
 * @desc    initialize a note
 * @access  Public
 */
router.put('/init/:id', (req, res) => {
  const cumulativeResponse = [];
  Note.findById(req.params.id)
    .then(note => {
      Object.keys(req.body.note).forEach(updateKey => {
        note[updateKey] = req.body.note[updateKey];
      });
      note.save().then(() => {
        cumulativeResponse.push('note successfully initialized');
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ success: false, err: err });
    });

  if (req.body.note.isAnnotation) {
    Section.findById(req.body.note.isAnnotation.sectionId)
      .then(section => {
        section.directConnections.push({
          resId: req.params.id,
          resType: 'note'
        });
        console.log('section.directConnections', section.directConnections);
        section.save().then(() => {
          cumulativeResponse.push(
            'section successfully informed about child note'
          );
        });
      })
      .catch(err => res.status(404).json({ success: false, err: err }));
    Text.findById(req.body.note.isAnnotation.textId)
      .then(text => {
        text.directConnections.push({ resId: req.params.id, resType: 'note' });
        text.save().then(() => {
          cumulativeResponse.push(
            'text successfully informed about child note'
          );
        });
      })
      .catch(err => res.status(404).json({ success: false, err: err }));
  }

  // if has parent node
  if (req.body.note.indirectConnections.length === 1) {
    Note.findById(req.body.note.indirectConnections[0].resId)
      .then(note => {
        note.directConnections = [
          ...new Set(
            ...note.directConnections.concat({
              resId: req.params.id,
              resType: 'note'
            })
          )
        ];
        note
          .save()
          .then(() =>
            cumulativeResponse.push(
              'parent note successfully informed about child note'
            )
          );
      })
      .catch(err => res.status(404).json({ success: false, err: err }));
  }

  if (req.body.note.isReply) {
    Note.findById(req.body.note.isReply.noteId)
      .then(note => {
        note.replies = note.replies
          .filter(reply => reply.resId !== req.params.id)
          .concat({
            resId: req.params.id,
            resType: 'note'
          });
        note
          .save()
          .then(() =>
            cumulativeResponse.push(
              'note successfully informed about its reply'
            )
          );
      })
      .catch(err => res.status(404).json({ success: false, err: err }));
  }

  res.json({ success: true, info: cumulativeResponse }); //2do make this work
});

/**
 * @route   PUT api/note/:id
 * @desc    update a note
 * @access  Public
 */
router.put('/:id', (req, res) => {
  console.log(
    '--------(UPDATE NOTE)',
    req.params.id,
    'BODY:',
    req.body,
    '-----------'
  );
  Note.findById(req.params.id)
    .then(note => {
      Object.keys(req.body.note).forEach(updateKey => {
        note[updateKey] = req.body.note[updateKey];
      });
      note.save().then(() => {});
    })
    .catch(err => res.status(404).json({ success: false, err: err }));
  console.log('--------(+)', req.body.connectionsToAdd, '-----------');
  if (req.body.connectionsToAdd) {
    req.body.connectionsToAdd.forEach(connectionId => {
      Note.findById(connectionId)
        .then(note => {
          if (
            !note.indirectConnections.some(el => el.resId === req.params.id)
          ) {
            note.indirectConnections = [
              ...note.indirectConnections,
              {
                resId: req.params.id,
                resType: 'note' // is it always of type note?
              }
            ];
          }
          note.save().then(() =>
            res.json({
              success: true
            })
          );
        })
        .catch(err => res.status(404).json({ success: false, err: err }));
    });
  }
  console.log('--------(-)', req.body.connectionsToRemove, '-----------');

  if (req.body.connectionsToRemove) {
    req.body.connectionsToRemove.forEach(connectionId => {
      Note.findById(connectionId)
        .then(note => {
          note.indirectConnections = note.indirectConnections.filter(
            el => el.resId !== req.params.id
          );
          note.save().then(() =>
            res.json({
              success: true
            })
          );
        })
        .catch(err => res.status(404).json({ success: false, err: err }));
    });
  }
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

/**
 * @route   DELETE api/notes/:id
 * @desc    delete a note
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  Note.findById(req.params.id)
    .then(section => section.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false, err: err }));
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
