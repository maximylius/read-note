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
  // update connection of other documents
  // document type could be: User, Text, Section, Note
  // update could be subject to multiple types.
  // textId
  // directConnections
  // indirectConnections
  // connections both ways.
  // From note update, the following could happen:
  // isAnnotation, isReply
  // can it happen that changes appear to a document multiple times?
  // convert ids to string before comparing to string.

  Note.findById(req.params.id)
    .then(note => {
      const promises = [];

      // if change in isAnnotation // does not account for remove of isAnnotation
      if (
        (req.body.isAnnotation && !note.isAnnotation) ||
        req.body.isAnnotation.textId !== note.isAnnotation.textId ||
        req.body.isAnnotation.sectionId !== note.isAnnotation.sectionId
      ) {
        console.log('change in isAnnotation');
        promises.push(
          Text.findById(req.body.isAnnotation.textId).then(text => {
            if (
              !text.directConnections.some(
                c => c.resId.toString() === req.params.resId
              )
            )
              text.directConnections.push({
                resId: req.params.resId,
                resType: 'note'
              });
            text.save();
          })
        );
        promises.push(
          Section.findById(req.body.isAnnotation.sectionId).then(section => {
            if (
              !section.directConnections.some(
                c => c.resId.toString() === req.params.resId
              )
            )
              section.directConnections.push({
                resId: req.params.resId,
                resType: 'note'
              });
            section.save();
          })
        );
      }

      // if change in isReply // does not account for remove of isReply
      if (
        (req.body.isReply && !note.isReply) ||
        req.body.isReply.noteId !== note.isReply.noteId
      ) {
        promises.push(
          Note.findById(req.body.isReply.noteId).then(note => {
            if (
              !note.replies.some(c => c.resId.toString() === req.params.resId)
            )
              note.replies.push({ resId: req.params.resId, resType: 'note' });
            note.save();
          })
        );
      }

      // add new connections and remove connections. in map() it is...
      //    set whether connection is direct (or indirect) relative to req.params.id.
      //    set whether new connection shall be added or old removed
      const connectionsToAddAndToRemove = [];
      if (req.body.note.directConnections) {
        connectionsToAddAndToRemove.push(
          ...addedConnections(
            req.body.note.directConnections,
            note.directConnections
          ).map(c => ({ ...c, isDirect: true, add: true })),
          ...removedConnections(
            req.body.note.directConnections,
            note.directConnections
          ).map(c => ({ ...c, isDirect: true }))
        );
      }
      if (req.body.note.indirectConnections)
        connectionsToAddAndToRemove.push(
          ...addedConnections(
            req.body.note.indirectConnections,
            note.indirectConnections
          ).map(c => ({ ...c, add: true })),
          ...removedConnections(
            req.body.note.indirectConnections,
            note.indirectConnections
          ).map(c => c)
        );
      connectionsToAddAndToRemove.forEach(connection => {
        promises.push(
          (connection.resType === 'text'
            ? Text
            : connection.resType === 'section'
            ? Section
            : connection.resType === 'note'
            ? Note
            : null
          )
            .findById(connection.resId)
            .then(doc => {
              if (connection.isDirect) {
                doc.indirectConnections = doc.indirectConnections.filter(
                  c => c.resId.toString() !== req.params.id
                );
                if (connection.add)
                  doc.indirectConnections.push({
                    resId: req.params.id,
                    resType: 'section'
                  });
              } else {
                doc.directConnections = doc.directConnections.filter(
                  c => c.resId.toString() !== req.params.id
                );
                if (connection.add)
                  doc.directConnections.push({
                    resId: req.params.id,
                    resType: 'section'
                  });
              }
              doc.save();
            })
        );
      });

      Object.keys(req.body.section).forEach(updateKey => {
        // if (updateKey === 'votes') {
        //   section[updateKey] = section[updateKey]
        //     .filter(el => el.userId !== '2do')
        //     .concat({
        //       // userId: "2do",
        //       userReputation: 0,
        //       bill: 1 //2do
        //     });
        // } else {
        section[updateKey] = req.body.section[updateKey];
        // }
      });
      promises.push(section.save());
      return Promise.all(promises);
    })
    .then(() =>
      res.json({
        success: true
      })
    )
    .catch(err => res.status(404).json({ success: false, err: err }));
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
