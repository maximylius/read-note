const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  // info
  title: { type: String, default: '' },

  // content
  delta: { type: Object, default: { op: [{ insert: '\n' }] } },
  plainText: { type: String, default: '' },

  // link
  directConnections: [{ type: Schema.Types.ObjectId }],
  indirectConnections: [{ type: Schema.Types.ObjectId }],
  isAnnotation: {
    type: Object,
    textId: { type: Schema.Types.ObjectId, ref: 'text' },
    sectionId: { type: Schema.Types.ObjectId, ref: 'text' },
    default: null
  },

  // meta
  created: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = Note = mongoose.model('Note', schema);
