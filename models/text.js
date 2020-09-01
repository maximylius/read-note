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
  //    parents
  projectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  //    children
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  //    connections
  directConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section // contains section-notes
    }
  ],
  indirectConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section
    }
  ],

  // meta
  created: { type: Date, default: null },
  lastEdited: { type: Date, default: null },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: false }
});

module.exports = Text = mongoose.model('Text', schema);
