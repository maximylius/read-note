const express = require('express');
const router = express.Router();

// Sections Model
const Section = require('../../models/section');

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
 * @route   PUT api/sections/:id
 * @desc    update a section
 * @access  Public
 */
router.put('/:id', (req, res) => {
  Section.findById(req.params.id)
    .then(section => {
      Object.keys(req.body).forEach(updateKey => {
        section[updateKey] = req.body[updateKey];
      });
      section.save().then(() =>
        res.json({
          success: true
        })
      );
    })
    .catch(err => res.status(404).json({ success: false, err: err }));
});

/**
 * @route   PUT api/sections/connections/:id
 * @desc    update a section
 * @access  Public
 */
router.put('/connections/:id', (req, res) => {
  if (req.params.add) {
    Section.findById(req.params.id)
      .then(section => {
        section.directConnections = section.directConnections.concat(
          ...[
            ['two-way', 'outgoing'].includes(req.body.add.connectionType)
              ? [{ resId: req.body.add.connectionId, resType: 'section' }]
              : []
          ]
        );
        section.indirectConnections = section.indirectConnections.concat(
          ...[
            ['two-way', 'incoming'].includes(req.body.add.connectionType)
              ? [{ resId: req.body.add.connectionId, resType: 'section' }]
              : []
          ]
        );

        section.save().then(() =>
          Section.findById(req.body.add.connectionId).then(section => {
            section.directConnections = section.directConnections.concat(
              ...[
                ['two-way', 'incoming'].includes(req.body.add.connectionType)
                  ? [{ resId: req.body.add.sectionId, resType: 'section' }]
                  : []
              ]
            );
            section.indirectConnections = section.indirectConnections.concat(
              ...[
                ['two-way', 'outgoing'].includes(req.body.add.connectionType)
                  ? [{ resId: req.body.add.sectionId, resType: 'section' }]
                  : []
              ]
            );

            section.save().then(() =>
              res.json({
                success: true
              })
            );
          })
        );
      })
      .catch(err => res.status(404).json({ success: false, err: err }));
  }

  if (req.params.remove) {
    Section.findById(req.params.id)
      .then(section => {
        section.directConnections = section.directConnections.filter(
          connection => connection.resId !== req.body.remove.connectionId
        );
        section.indirectConnections = section.indirectConnections.filter(
          connection => connection.resId !== req.body.remove.connectionId
        );

        section.save().then(() =>
          Section.findById(req.body.remove.connectionId).then(section => {
            section.directConnections = section.directConnections.filter(
              connection => connection.resId !== req.body.remove.sectionId
            );
            section.indirectConnections = section.indirectConnections.filter(
              connection => connection.resId !== req.body.remove.sectionId
            );

            section.save().then(() =>
              res.json({
                success: true
              })
            );
          })
        );
      })
      .catch(err => res.status(404).json({ success: false, err: err }));
  }
});

/**
 * @route   DELETE api/sections/:id
 * @desc    delete one section or many sections
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  // split at + to detect if multiple
  const sectionIds = req.params.id.split('+');
  if (sectionIds.length === 1) {
    // single delete
    Section.findById(sectionIds[0])
      .then(section => section.remove().then(() => res.json({ success: true })))
      .catch(err => res.status(404).json({ success: false }));
  } else {
    // delete many
    Section.deleteMany({ _id: { $in: sectionIds } }, (err, result) => {
      if (err) {
        res.status(400).json({ err });
      } else {
        res.json(result.n);
      }
    });
  }
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
