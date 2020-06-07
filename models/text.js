const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  textcontent: { type: String, default: '' }, //also represented in delta.
  deltas: { type: Object }, //contain formatted text
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }],

  ISBN: { type: String, default: '' },
  url: { type: String, default: '' },
  title: { type: String, default: '' },
  author: { type: String, default: '' },
  language: { type: String },
  keywords: [{ type: String }],
  publishedIn: { type: String, default: '' },
  publicationDate: { type: String, default: '' },

  created: { type: Date },
  lastEdited: { type: Date },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }] // if [] => public
});

module.exports = Text = mongoose.model('Text', schema);
