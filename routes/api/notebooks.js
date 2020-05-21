const express = require('express');
const router = express.Router();

// Notebook Model
const Notebook = require('../../models/notebook');

/**
 * @route   GET api/notebooks
 * @desc    GET All Notebooks
 * @access  Public
 */
router.get('/', (req, res) => {
  Notebook.find().then(notebooks => res.json(notebooks));
});

/**
 * @route   GET api/notebooks/id/:id
 * @desc    GET single Notebook by id
 * @access  Public
 */
router.get('/:id', (req, res) => {
  Notebook.find({ _id: { $in: req.params.id.split('+') } }).then(notebooks =>
    res.json(notebooks)
  );
});

/**
 * @route   GET api/notebooks/search/:searchfields&:searchstring
 * @desc    GET Notebook search results for searching string
 * @access  Public
 */
router.get('/search/:searchfields&:searchstring', (req, res) => {
  if (req.params.searchfields === 'all') {
    Notebook.find(
      {
        $notebook: {
          $search: req.params.searchstring,
          $language: 'none',
          $caseSensitive: false
        }
      },
      { score: { $meta: 'notebookScore' } }
    )
      .sort({ score: { $meta: 'notebookScore' } })
      .then(notebooks =>
        res.json(
          // return only necessary parts of notebooks
          notebooks.map(notebook => ({
            _id: notebook._id,
            title: notebook.title,
            author: notebook.author,
            publicationDate: notebook.publicationDate,
            keywords: notebook.keywords
          }))
        )
      );
  } else {
  }
});

/**
 * @route   POST api/notebooks
 * @desc    post a Notebook
 * @access  Public
 */
router.post('/', (req, res) => {
  const notebook = new Notebook({});
  Object.keys(req.body).forEach(updateKey => {
    notebook[updateKey] = req.body[updateKey];
  });

  notebook
    .save()
    .then(notebookres => res.json(notebookres))
    .catch(err => res.status(400).json({ err }));
});

/**
 * @route   POST api/notebooks/spareids/:number
 * @desc    get spare id(s)
 * @access  Public
 */
router.post('/spareids/:number', (req, res) => {
  let spareDocuments = [];
  for (let i = 0; i < Number(req.params.number); i++) {
    spareDocuments.push(new Notebook({ type: 'SPARE', content: '' }));
  }

  Notebook.collection.insertMany(spareDocuments, (err, docs) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json({ spareIds: spareDocuments.map(doc => doc._id) });
    }
  });
});

/**
 * @route   PUT api/notebook/:id
 * @desc    update a notebook
 * @access  Public
 */
router.put('/:id', (req, res) => {
  Notebook.findById(req.params.id)
    .then(notebook => {
      Object.keys(req.body).forEach(updateKey => {
        notebook[updateKey] = req.body[updateKey];
      });
      notebook.save().then(() =>
        res.json({
          success: true
        })
      );
    })
    .catch(err => res.status(404).json({ success: false, err: err }));
});

/**
 * @route   DELETE api/notebooks/:id
 * @desc    delete a notebook
 * @access  Public
 */
router.delete('/:id', (req, res) => {
  Notebook.findById(req.params.id)
    .then(section => section.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false, err: err }));
});

/**
 * @route   DELETE api/notebooks/spareids/:minutestoexpire
 * @desc    delete one notebook or many notebooks
 * @access  Public
 */
router.delete('/spareids/:minutestoexpire', (req, res) => {
  Notebook.deleteMany({ $and: [{ editedBy: { $size: 0 } }] }, (err, result) => {
    if (err) {
      res.status(400).json({ err });
    } else {
      res.json(result.n);
    }
  });
});

module.exports = router;
