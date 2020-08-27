const express = require('express');
const router = express.Router();

// import Models
const User = require('../../models/user');
const Text = require('../../models/text');
const Section = require('../../models/section');
const Note = require('../../models/note');
const c = require('config');

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
  return deleteArray.map(serachObj => {
    return returnCollection(serachObj.resType)
      .findById(serachObj.resId)
      .then(doc => {
        console.log('found doc to delete of type', serachObj.resType);
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
        console.log('innerDeleteArray', innerDeleteArray);

        if (innerDeleteArray.length > 0) {
          return Promise.all(
            nestedDelete(innerDeleteArray, connections, blacklist)
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
 * @route   DELETE api/common/:restype/:id
 * @desc    delete one section or many sections
 * @access  Public
 */
router.delete('/:restype/:id', (req, res) => {
  // split at + to detect if multiple
  const deleteIds = req.params.id.split('+');
  const deleteArray = deleteIds.map(id => ({
    resId: id,
    resType: req.params.restype
  }));
  const connections = []; //2do delete from User also.
  const blacklist = deleteIds;
  console.log('starting ', req.params.restype, ' delete', deleteArray);
  // this function needs to be executed while deleteArrays[deleteArrayIndex].length>0
  // but execution of next level is just allowed to start after previous is finished.

  Promise.all(nestedDelete(deleteArray, connections, blacklist))
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
            return returnCollection(connection.resType)
              .findById(connection.resId)
              .then(doc => {
                console.log('found doc to update of type', connection.resType);
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

module.exports = router;
