const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  type: { type: String, default: '' },
  plainText: { type: String, default: '' }, // no markup, no linebreaks
  html: { type: String, default: '' }, // also represented in delta.
  deltas: [{ type: Object }], // do i need them at all?
  sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
  textId: { type: Schema.Types.ObjectId, ref: 'Text' },
  syncWith: [{ type: Schema.Types.ObjectId }], // where to updata
  connectedWith: [{ type: Schema.Types.ObjectId }], // collects all existing connection
  version: { type: String, default: 'v0' },
  created: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }] // if [] => public
});

module.exports = Annotations = mongoose.model('annotation', schema);
