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
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }], // 2do can i remove this? directConnections.filter(el => el.resType==="section")
  directConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section
    }
  ],
  indirectConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section
    }
  ],

  // meta
  created: { type: Date },
  lastEdited: { type: Date },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: false }
});

module.exports = Text = mongoose.model('Text', schema);
