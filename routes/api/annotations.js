const express = require('express');
const router = express.Router();

// Annotations Model
const Annotation = require('../../models/annotation');

/**
 * @route   GET api/annotations
 * @desc    GET All Annotations
 * @access  Public
 */
router.get('/', (req, res) => {
  Annotation.find().then(annotations => res.json(annotations));
});

/**
 * @route   GET api/annotations/:id
 * @desc    GET specific Annotations
 * @access  Public
 */
router.get('/:id', (req, res) => {
  Annotation.find({
    _id: { $in: req.params.id.split('+') }
  }).then(annotations => res.json(annotations));
});

/**
 * @route   POST api/annotations
 * @desc    create a annotation
 * @access  Public
 */
router.post('/', (req, res) => {
  const newAnnotation = new Annotation({
    type: req.body.type,
    content: req.body.content,
    editedBy: [] //2do current user
  });

  newAnnotation
    .save()
    .then(annotation => {
      res.json({ _id: annotation._id });
    })
    .catch(res => res.status(400).json({ success: false }));
});

/**
 * @route   POST api/annotations/spareids/:number
 * @desc    get spare id(s)
 * @access  Public
 */
router.post('/spareids/:number', (req, res) => {
  let spareDocuments = [];
  for (let i = 0; i < Number(req.params.number); i++) {
    spareDocuments.push(new Annotation({ type: 'SPARE', content: '' }));
  }

  Annotation.collection.insertMany(spareDocuments, (err, docs) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json({ spareIds: spareDocuments.map(doc => doc._id) });
    }
  });
});

/**
 * @route   PUT api/annotations/:id
 * @desc    update a annotation
 * @access  Public
 */
router.put('/:id', (req, res) => {
  Annotation.findById(req.params.id)
    .then(annotation => {
      Object.keys(req.body).forEach(updateKey => {
        annotation[updateKey] = req.body[updateKey];
      });
      annotation.save().then(() =>
        res.json({
          success: true
        })
      );
    })
    .catch(err => res.status(404).json({ success: false, err: err }));
});

/**
 * @route   PUT api/annotations/:id/deletednotebook/:notebookid
 * @desc    update a annotation
 * @access  Public
 */
router.put('/:id', (req, res) => {
  Annotation.findById(req.params.id)
    .then(annotation => {
      annotation.conectedWith = annotation.conectedWith.filter(
        id => id !== req.params.notebookid
      );
      annotation.save().then(() =>
        res.json({
          success: true
        })
      );
    })
    .catch(err => res.status(404).json({ success: false, err: err }));
});

/**
 * @route   DELETE api/annotations/:id
 * @desc    delete one annotation or many annotations
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  // split at + to detect if multiple
  const annotationIds = req.params.id.split('+');
  if (annotationIds.length === 1) {
    // single delete
    Annotation.findById(annotationIds[0])
      .then(annotation =>
        annotation.remove().then(() => res.json({ success: true }))
      )
      .catch(err => res.status(404).json({ success: false }));
  } else {
    // delete many
    Annotation.deleteMany({ _id: { $in: annotationIds } }, (err, result) => {
      if (err) {
        res.status(400).json({ err });
      } else {
        res.json(result.n);
      }
    });
  }
});

/**
 * @route   DELETE api/annotations/spareids/:minutestoexpire
 * @desc    delete one annotation or many annotations
 * @access  Public
 */
router.delete('/spareids/:minutestoexpire', (req, res) => {
  Annotation.deleteMany(
    { $and: [{ editedBy: { $size: 0 } }] },
    (err, result) => {
      if (err) {
        res.status(400).json({ err });
      } else {
        res.json(result.n);
      }
    }
  );
});

module.exports = router;
