const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  // info
  title: { type: String },
  categoryIds: [{ type: String }],
  begin: { type: Number },
  end: { type: Number },

  // contents
  fullWords: { type: String },
  html: { type: String },
  delta: { type: Object, default: { ops: [{ insert: '\n' }] } },

  // links
  textId: { type: Schema.Types.ObjectId, ref: 'Text' },
  noteIds: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  directConnections: [{ type: Schema.Types.ObjectId }],
  indirectConnections: [{ type: Schema.Types.ObjectId }],

  // meta
  created: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = Section = mongoose.model('sections', schema);
