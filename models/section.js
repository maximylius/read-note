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
  //    parents
  textId: { type: Schema.Types.ObjectId, ref: 'Text' },
  projectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  //    children
  noteIds: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  //    connections
  directConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } // section
    }
  ],
  indirectConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } // section | note
    }
  ],

  // meta
  created: { type: Date, default: null },
  lastEdited: { type: Date, default: null },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: false }
});

module.exports = Section = mongoose.model('sections', schema);
