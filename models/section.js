const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  // info
  title: { type: String },
  categoryIds: [{ type: String }],
  begin: { type: Number },
  end: { type: Number },
  importance: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number }
    }
  ],

  // contents
  fullWords: { type: String },
  html: { type: String },
  delta: { type: Object, default: { ops: [{ insert: '\n' }] } },

  // links
  textId: { type: Schema.Types.ObjectId, ref: 'Text' }, // 2do: will this be the only text in direct connections? Yes. But: it is an overhead to iterate of the direct connections to find the text. but you rarely need to do that.
  directConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section // will include: parentText, those notes that shall be displayed, and connected sections.
    }
  ],
  indirectConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section
    }
  ],

  // meta
  created: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = Section = mongoose.model('sections', schema);
