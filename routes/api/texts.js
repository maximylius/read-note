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
 * @route   DELETE api/texts/:id
 * @desc    delete a text
 * @access  Public
 */
// delete documents and get documents_ids that got affected by the delete
// deleteIds.forEach(id => {
//   promises.push(
//     Text.findById(id).then(doc => {
//       deleteIds.push(...text.sectionIds.map(id=>({resId:id, resType:"section"}))); //possible duplicates
//       [
//         ...doc.directConnections,
//         ...doc.indirectConnections
//       ].forEach(connection => {
//         if (
//           !deleteIds.includes(connection.resId.toString()) &&
//           !connections.some(
//             c => c.resId.toString() === connection.resId.toString()
//           )
//         ) {
//           connections.push(connection);
//         }
//       });
//       doc.remove();
//     })
//   );
// });

const returnCollection = resType => {
  return resType === 'text'
    ? Text
    : resType === 'section'
    ? Section
    : resType === 'note'
    ? Note
    : resType === 'user'
    ? User
    : null;
};

const nestedDelete = (deleteArray, connections, blacklist) => {
  deleteArray.map(serachObj => {
    return returnCollection(serachObj.resType)
      .findById(serachObj.resId)
      .then(doc => {
        const innerDeleteArray = [
          ...(serachObj.resType === 'text' // && req.body.deleteChildSections
            ? doc.sectionIds.map(id => ({ resId: id, resType: 'section' }))
            : []),
          ...(serachObj.resType === 'section' // && req.body.deleteChildNotes
            ? doc.directConnections.filter(c => c.resType === 'note')
            : []),
          ...(serachObj.resType === 'note' ? doc.replies : []) // && req.body.deleteChildNotes
          // maybe work with nested level. docsToDelte[0], docsToDelte[1], docsToDelte[2]... if at some point docsToDelte[2].length === 0 it does not have to be nested further.
        ].filter(del => {
          if (blacklist.includes(del.resId.toString())) return false;
          blacklist.push(del.resId.toString());
          return true;
        });

        connections.push(
          ...doc.directConnections,
          ...doc.indirectConnections,
          ...(serachObj.resType === 'section'
            ? [{ resId: doc.textId, resType: 'text' }]
            : []),
          ...(serachObj.resType === 'note' && doc.isAnnotation
            ? [
                { resId: doc.isAnnotation.textId, resType: 'text' },
                { resId: doc.isAnnotation.sectionId, resType: 'section' }
              ]
            : []),
          ...(serachObj.resType === 'note' && doc.isReply
            ? [{ resId: doc.isReply.noteId, resType: 'note' }]
            : [])
        );

        if (innerDeleteArray.length > 0) {
          Promise.all(
            nestedDelete(innerDeleteArray, connections, blacklist)
          ).then(() => {
            return doc.remove();
          });
        } else {
          return doc.remove();
        }
      });
  });
};

router.delete('/:id', (req, res) => {
  // split at + to detect if multiple
  const deleteIds = req.params.id.split('+');
  const deleteArray = deleteIds.map(id => ({ resId: id, resType: 'text' }));
  const connections = []; //2do delete from User also.
  const blacklist = deleteIds;

  // this function needs to be executed while deleteArrays[deleteArrayIndex].length>0
  // but execution of next level is just allowed to start after previous is finished.

  Promise.all(nestedDelete(deleteArray, connections, blacklist))
    .then(() => {
      const deletedIds = [...blacklist];
      Promises.all(
        connections
          .filter(c => {
            if (blacklist.includes(c.resId.toString())) return false;
            blacklist.push(c.resId.toString());
            return true;
          })
          .map(connection => {
            returnCollection(connection.resType)
              .findById(connection.resId)
              .then(doc => {
                if (Array.isArray(doc.directConnections))
                  doc.directConnections = doc.directConnections.filter(
                    c => !deletedIds.includes(c.resId.toString())
                  );
                if (Array.isArray(doc.indirectConnections))
                  doc.indirectConnections = doc.indirectConnections.filter(
                    c => !deletedIds.includes(c.resId.toString())
                  );
                if (
                  connection.resType === 'text' &&
                  Array.isArray(doc.sectionIds)
                )
                  doc.sectionIds = doc.sectionIds.filter(
                    id => !deletedIds.includes(id.toString())
                  );
                if (
                  connection.resType === 'note' &&
                  doc.isAnnotation &&
                  deletedIds.includes(doc.isAnnotation.sectionId.toString())
                )
                  doc.isAnnotation.sectionId = null;
                if (connection.resType === 'note' && Array.isArray(doc.replies))
                  doc.replies = doc.replies.filter(
                    reply => !deletedIds.includes(reply.resId.toString())
                  );

                doc.save();
              });
          })
      ).then(() => {
        console.log('delete successfull');
        res.json({
          success: true
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ success: false, err: err });
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
