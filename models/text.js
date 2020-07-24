const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  //  info
  title: { type: String, default: '' },
  ISBN: { type: String, default: '' },
  url: { type: String, default: '' },
  author: { type: String, default: '' },
  language: { type: String },
  keywords: [{ type: String }],
  publishedIn: { type: String, default: '' },
  publicationDate: { type: String, default: '' },

  // contents
  textcontent: { type: String, default: '' },
  delta: { type: Object },

  // links
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  directConnections: [{ type: Schema.Types.ObjectId }],
  indirectConnections: [{ type: Schema.Types.ObjectId }],

  // meta
  created: { type: Date },
  lastEdited: { type: Date },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = Text = mongoose.model('Text', schema);
