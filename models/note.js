const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  // info
  title: { type: String, default: '' },

  // content
  delta: { type: Object, default: { op: [{ insert: '\n' }] } },
  plainText: { type: String, default: '' },

  // link
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
  replies: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section
    }
  ],
  isReply: {
    type: Object,
    noteId: { type: Schema.Types.ObjectId, ref: 'Note' },
    default: null
  },
  isAnnotation: {
    type: Object,
    textId: { type: Schema.Types.ObjectId, ref: 'Text' },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
    default: null
  },
  votes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      userReputation: { type: Number },
      bill: { type: Number }
    }
  ], //maybe this should be a server thing, thats just transimitting the plain result to the client

  // meta
  created: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = Note = mongoose.model('Note', schema);
