const express = require('express');
const router = express.Router();
const getUserId = require('../../middleware/getUserId');

// import Models
const User = require('../../models/user');
const Project = require('../../models/project');
const Text = require('../../models/text');
const Section = require('../../models/section');
const Note = require('../../models/note');

/**
 * @HELPER_FUNCTIONS
 */
// SELECT COLLECTION
const returnCollection = resType => {
  let str = resType.replace(/s$/, '');
  const Collection =
    str === 'text'
      ? Text
      : str === 'section'
      ? Section
      : str === 'note'
      ? Note
      : str === 'user'
      ? Project
      : str === 'project'
      ? User
      : null;

  if (!Collection)
    throw `Document type '${resType}' cannot be matched with a collection.`;
  return Collection;
};

// PUT RETRIEVE CONNECTION DIFFERENCE
const connectionCompare = (arr, filterArr) => {
  return arr
    .filter(
      el =>
        !filterArr.some(
          filterEl => filterEl.resId.toString() === el.resId.toString()
        )
    )
    .map(el => ({
      resId: el.resId,
      resType: el.resType
    }));
};
const addedConnections = (req, sav) => connectionCompare(req, sav);
const removedConnections = (req, sav) => connectionCompare(sav, req);

// DELETE NESTED DOCUMENTS
const nestedDelete = (deleteArray, connections, blacklist, req) => {
  return deleteArray.map(serachObj => {
    return returnCollection(serachObj.resType)
      .findById(serachObj.resId)
      .then(doc => {
        if (!doc)
          console.log(
            '------------0---1----0---0----0---0----0---0-------------'
          );
        console.log('found doc to delete of type', serachObj.resType);
        if (
          doc.accessFor.length > 0 &&
          (!req.userId ||
            !doc.accessFor.map(id => id.toString()).includes(req.userId))
        ) {
          if (blacklist.indexOf(serachObj.resId) > 0)
            blacklist.splice(blacklist.indexOf(serachObj.resId), 1);
          console.log('NOT DELETED: missing AUTHORIZATION');
          return Promise.resolve();
        }
        const innerDeleteArray = [
          ...(serachObj.resType === 'text' &&
          req.body.shouldDeleteTypes.includes('section')
            ? doc.sectionIds.map(id => ({ resId: id, resType: 'section' }))
            : []),
          ...(serachObj.resType === 'section' &&
          req.body.shouldDeleteTypes.includes('note')
            ? doc.directConnections.filter(c => c.resType === 'note')
            : []),
          ...(serachObj.resType === 'note' &&
          req.body.shouldDeleteTypes.includes('note')
            ? doc.replies.map(id => ({ resId: id, resType: 'note' }))
            : [])
        ].filter(del => {
          if (blacklist.includes(del.resId.toString())) return false;
          if (req.body.shouldDeleteTypes.includes(del.resType)) return false;
          blacklist.push(del.resId.toString());
          return true;
        });

        console.log(serachObj.resType, 'doc', doc);
        connections.push(
          ...doc.directConnections,
          ...doc.indirectConnections,
          ...(serachObj.resType === 'section'
            ? [{ resId: doc.textId, resType: 'text' }] // why can this be undefined?
            : []),
          ...(serachObj.resType === 'note' && doc.isAnnotation
            ? [
                { resId: doc.isAnnotation.textId, resType: 'text' },
                { resId: doc.isAnnotation.sectionId, resType: 'section' }
              ]
            : []),
          ...(serachObj.resType === 'note' && doc.isReply
            ? [{ resId: doc.isReply.noteId, resType: 'note' }]
            : []),
          ...doc.editedBy.map(resId => ({ resId, resType: 'user' }))
        );
        console.log('innerDeleteArray', innerDeleteArray);

        if (innerDeleteArray.length > 0) {
          return Promise.all(
            nestedDelete(innerDeleteArray, connections, blacklist, req)
          ).then(() => {
            console.log('nesting deeper');
            return doc.remove();
          });
        } else {
          console.log('returning');
          return doc.remove();
        }
      });
  });
};

/**
 * @route   GET api/common/:restype/:id
 * @desc    GET specific Documents
 * @access  Public
 */
router.get('/:restype/:id', getUserId, (req, res) => {
  if (req.params.restype === 'user')
    return res.status(401).json({
      success: false,
      err: 'Not allowed to request user data with this route.'
    });

  returnCollection(req.params.restype)
    .find({
      _id: { $in: req.params.id.split('+') },
      $or: [
        { accessFor: { $size: 0 } },
        ...(req.userId
          ? [{ accessFor: { $elemMatch: { $eq: req.userId } } }]
          : [])
      ]
    })
    .then(docArray => {
      res.json({ docArray });
    })
    .catch(err => {
      console.log('err in get', err);
      res.status(404).json({ success: false, err: err });
    });
});

/**
 * @route   POST api/common/:restype
 * @desc    create a document
 * @access  Public
 */
router.post('/:restype', (req, res) => {
  const Collection = returnCollection(req.params.restype);
  const mongoDoc = new Collection({
    ...req.body.doc
  });

  mongoDoc
    .save()
    .then(doc => {
      res.json({ _id: doc._id });
    })
    .catch(err => res.status(400).json({ success: false, err }));
});

/**
 * @route   POST api/common/spareids/:restype/:number
 * @desc    get spare id(s)
 * @access  Public
 */
router.post('/spareids/:restype/:number', (req, res) => {
  const Collection = returnCollection(req.params.restype);
  Collection.insertMany(
    [...Array(Math.min(100, Number(req.params.number)))].map(
      () => new Collection({})
    ) // maximum of 100 spareIds
  )
    .then(docs => res.json({ spareIds: docs.map(doc => doc._id) }))
    .catch(err => {
      console.log(err);
      res.status(400).json({ err });
    });
});

/**
 * @route   PUT api/common/:restype/:id
 * @desc    update a document
 * @access  Public
 */
router.put('/:restype/:id', getUserId, (req, res) => {
  console.log('req.body.doc', req.body.doc);
  returnCollection(req.params.restype)
    .findById(req.params.id)
    .then(mongoDoc => {
      if (!mongoDoc)
        return res
          .status(404)
          .json({ success: false, msg: 'Document not found.' });

      if (
        mongoDoc.accessFor.length > 0 &&
        (!req.userId ||
          !mongoDoc.accessFor.map(id => id.toString()).includes(req.userId))
      )
        return res.status(401).json({
          success: false,
          msg: `Unauthorized to manipulate the document.${
            !req.userId ? ' Sign in if possible.' : ''
          }`
        });
      const promises = [];
      console.log('mongoDoc.created', mongoDoc.created);
      // if new document
      if (!mongoDoc.created && req.params.restype !== 'user') {
        mongoDoc.created = Date.now(); //add creation date.
        //  add to user
        if (req.userId) {
          promises.push(
            User.findById(req.userId).then(user => {
              if (req.params.restype === 'text') {
                user.textIds.push(req.params.id);
              } else if (req.params.restype === 'section') {
                user.sectionIds.push(req.params.id);
              } else if (req.params.restype === 'note') {
                user.noteIds.push(req.params.id);
              } else return Promise.resolve();
              return user.save();
            })
          );
        }
      }

      // SECTION SPECIFIC TASKS
      if (req.params.restype === 'section') {
        // update (order of) sectionIds of text
        if (req.body.previousTextSectionId) {
          promises.push(
            Text.findById(req.body.doc.textId || mongoDoc.textId).then(text => {
              console.log(
                'update text-sectionIds. insert at',
                text.sectionIds.indexOf(req.body.previousTextSectionId._id) + 1
              );
              text.sectionIds = text.sectionIds.filter(
                id => id.toString() !== req.params.id
              );
              text.sectionIds.splice(
                text.sectionIds.indexOf(req.body.previousTextSectionId._id) + 1,
                0,
                req.params.id
              );
              return text.save();
            })
          );
        }
      }

      // NOTE SPECIFIC TASKS
      if (req.params.restype === 'note') {
        // if change in isAnnotation // does not account for remove of isAnnotation
        if (
          req.body.doc.isAnnotation &&
          (!mongoDoc.isAnnotation ||
            req.body.doc.isAnnotation.textId !== mongoDoc.isAnnotation.textId ||
            req.body.doc.isAnnotation.sectionId !==
              mongoDoc.isAnnotation.sectionId)
        ) {
          console.log('change in isAnnotation');
          promises.push(
            Text.findById(req.body.doc.isAnnotation.textId).then(doc => {
              if (
                !doc.directConnections.some(
                  c => c.resId.toString() === req.params.id
                )
              )
                doc.directConnections.push({
                  resId: req.params.id,
                  resType: req.params.restype
                });
              return doc.save();
            })
          );
          promises.push(
            Section.findById(req.body.doc.isAnnotation.sectionId).then(
              section => {
                if (section.noteIds.includes(req.params.id))
                  return Promise.resolve();
                section.noteIds.push(req.params.id);
                return section.save();
              }
            )
          );
        }

        // if change in isReply // does not account for remove of isReply
        if (
          req.body.doc.isReply &&
          (!mongoDoc.isReply ||
            req.body.doc.isReply.noteId !== mongoDoc.isReply.noteId)
        ) {
          promises.push(
            Note.findById(req.body.doc.isReply.noteId).then(note => {
              if (!note.replies.includes(req.params.id))
                note.replies.push(req.params.id);
              return note.save();
            })
          );
        }
      }

      // add new connections and remove connections. in map() it is...
      //    set whether connection is direct (or indirect) relative to req.params.id.
      //    set whether new connection shall be added or old removed
      const connectionsToAddAndToRemove = [];
      if (Array.isArray(req.body.doc.directConnections)) {
        connectionsToAddAndToRemove.push(
          ...addedConnections(
            req.body.doc.directConnections,
            mongoDoc.directConnections
          ).map(c => ({ ...c, isDirect: true, add: true })),
          ...removedConnections(
            req.body.doc.directConnections,
            mongoDoc.directConnections
          ).map(c => ({ ...c, isDirect: true }))
        );
      }
      if (Array.isArray(req.body.doc.indirectConnections)) {
        connectionsToAddAndToRemove.push(
          ...addedConnections(
            req.body.doc.indirectConnections,
            mongoDoc.indirectConnections
          ).map(c => ({ ...c, add: true })),
          ...removedConnections(
            req.body.doc.indirectConnections,
            mongoDoc.indirectConnections
          ).map(c => c)
        );
      }
      console.log('connectionsToAddAndToRemove', connectionsToAddAndToRemove);
      promises.push(
        ...connectionsToAddAndToRemove.map(connection => {
          return returnCollection(connection.resType)
            .findById(connection.resId)
            .then(doc => {
              console.log(
                'connection doc',
                'direct',
                doc.directConnections,
                'indirect',
                doc.indirectConnections
              );
              if (connection.isDirect) {
                doc.indirectConnections = doc.indirectConnections.filter(
                  c => c.resId.toString() !== req.params.id
                );
                if (connection.add)
                  doc.indirectConnections.push({
                    resId: req.params.id,
                    resType: req.params.restype
                  });
              } else {
                doc.directConnections = doc.directConnections.filter(
                  c => c.resId.toString() !== req.params.id
                );
                if (connection.add)
                  doc.directConnections.push({
                    resId: req.params.id,
                    resType: req.params.restype
                  });
              }
              console.log(
                'save connection doc',
                'direct',
                doc.directConnections,
                'indirect',
                doc.indirectConnections
              );
              return doc.save();
            });
        })
      );
      if (Array.isArray(req.body.doc.projectIds)) {
        const projectsToInform = [
          ...req.body.doc.projectIds
            .filter(projectId => !mongoDoc.projectIds.includes(projectId))
            .map(id => ({ resId: id, add: true })),
          ...mongoDoc.projectIds
            .filter(projectId => !req.body.doc.projectIds.includes(projectId))
            .map(id => ({ resId: id }))
        ];
        // add to doc to projects // this can be moved to standard put routine.
        promises.push(
          ...projectsToInform.map(c => {
            return Project.findById(c.resId).then(project => {
              const projectArray =
                req.params.restype === 'text'
                  ? project.textIds
                  : req.params.restype === 'section'
                  ? project.sectionIds
                  : req.params.restype === 'note'
                  ? project.noteIds
                  : null;
              if (!projectArray) return Promise.resolve();
              if (c.add) {
                projectArray.push(req.params.id);
              } else {
                const index = projectArray.indexOf(req.params.id);
                if (index < 0) {
                  console.log(
                    'cannot find id',
                    req.params.id,
                    ' in projectsIds:',
                    projectArray
                  );
                  return Promise.resolve();
                }
                projectArray.splice(index, 1);
              }
              return project.save();
            });
          })
        );
      }

      return Promise.all(promises).then(() => {
        console.log('mongoDoc updates:');
        Object.keys(req.body.doc).forEach(updateKey => {
          // if( req.params.restype==="section" && updateKey==="importance") { mongoDoc.importance = mongoDoc.importancef.filter().concat() } else { }
          // if(req.params.restype==="note" && updateKey==="votes") { mongoDoc.votes = mongoDoc.votesf.filter().concat() } else { }
          // editedBy can only be extended. // should not cotain duplicates.
          // accessFor can only be changed from document owner = first editor
          mongoDoc[updateKey] = req.body.doc[updateKey];
          if (Array.isArray(req.body.doc[updateKey]))
            console.log(updateKey, ':', req.body.doc[updateKey]);
        });
        return mongoDoc.save();
      });
    })
    .then(() => {
      console.log('COMMON PUT SUCCESSFULL');
      res.json({
        success: true
      });
    })
    .catch(err => {
      console.log('ERROR in COMMON PUT');
      console.log(err);
      res.status(404).json({ success: false, err: err });
    });
});

/**
 * @route   DELETE api/common/:restype/:id
 * @desc    delete one or many documents
 * @access  Public
 */
router.delete('/:restype/:id', getUserId, (req, res) => {
  // split at + to detect if multiple
  console.log('req.userId', req.userId);
  const deleteIds = req.params.id.split('+');
  const deleteArray = deleteIds.map(id => ({
    resId: id,
    resType: req.params.restype
  }));
  const connections = []; //2do delete from User also.
  const blacklist = deleteIds;
  console.log(
    'starting ',
    req.params.restype,
    ' delete',
    deleteArray,
    'with deleting sub:',
    req.body.shouldDeleteTypes
  );

  Promise.all(nestedDelete(deleteArray, connections, blacklist, req))
    .then(() => {
      console.log('connections', connections);
      console.log('blacklist', blacklist);
      const deletedIds = [...blacklist];
      Promise.all(
        connections
          .filter(c => {
            if (blacklist.includes(c.resId.toString())) return false;
            blacklist.push(c.resId.toString());
            return true;
          })
          .map(connection => {
            console.log('map connection', connection);
            return returnCollection(connection.resType)
              .findById(connection.resId)
              .then(doc => {
                console.log('found doc to update of type', connection.resType);
                // for every  connection.resType
                if (Array.isArray(doc.directConnections))
                  doc.directConnections = doc.directConnections.filter(
                    c => !deletedIds.includes(c.resId.toString())
                  );
                if (Array.isArray(doc.indirectConnections))
                  doc.indirectConnections = doc.indirectConnections.filter(
                    c => !deletedIds.includes(c.resId.toString())
                  );

                // if connection.resType === note
                if (
                  doc.isAnnotation &&
                  deletedIds.includes(doc.isAnnotation.sectionId.toString())
                )
                  doc.isAnnotation.sectionId = null;
                if (Array.isArray(doc.replies))
                  doc.replies = doc.replies.filter(
                    id => !deletedIds.includes(id.toString())
                  );

                // if connection.resType === user | project | text
                if (Array.isArray(doc.sectionIds))
                  doc.sectionIds = doc.sectionIds.filter(
                    id => !deletedIds.includes(id.toString())
                  );

                // if connection.resType === user | project
                if (Array.isArray(doc.textIds))
                  doc.textIds = doc.textIds.filter(
                    id => !deletedIds.includes(id.toString())
                  );
                if (Array.isArray(doc.noteIds))
                  doc.noteIds = doc.noteIds.filter(
                    id => !deletedIds.includes(id.toString())
                  );

                return doc.save();
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
 * @route   DELETE api/spareids/:minutestoexpire
 * @desc    delete spareIds older than.#
 * @access  Public
 */
router.delete('/spareids/:minutestoexpire', (req, res) => {
  let deleteBefore =
    Date.now() - 1000 * 60 * Math.min(60, Number(req.params.minutestoexpire));

  Promise.all(
    [Text, Section, Note].map(Collection =>
      Collection.deleteMany({
        $and: [{ editedBy: { $size: 0 } }, { created: { $lt: deleteBefore } }]
      })
    )
  )
    .then(result => {
      console.log('successfully deleted spareIds');
      res.json({
        success: true,
        n: result.n
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ success: false, err: err });
    });
});

// EXPORT ROUTE
module.exports = router;
