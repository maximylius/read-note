const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  textcontent: { type: String, default: '' },
  formatDivs: [
    {
      begin: { type: Number, required: true },
      end: { type: Number, required: true },
      div: { type: String, default: '' },
      fontWeight: { type: String, default: '' },
      textDecoration: { type: String, default: '' },
      color: { type: String, default: '' }
    }
  ],

  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section' }],

  ISBN: { type: String, default: '' },
  url: { type: String, default: '' },
  title: { type: String, default: '' },
  author: { type: String, default: '' },
  language: { type: String },
  keywords: [{ type: String, default: '' }],
  publishedIn: { type: String, default: '' },
  publicationDate: { type: String, default: '' },

  created: { type: Date },
  lastEdited: { type: Date },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }] // if [] => public
});

module.exports = Text = mongoose.model('Text', schema);
