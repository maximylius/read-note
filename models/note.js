const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  // info
  title: { type: String, default: '' },

  // content
  delta: { type: Object, default: { op: [{ insert: '\n' }] } },
  plainText: { type: String, default: '' },

  // links
  //    parents
  isAnnotation: {
    type: Object,
    textId: { type: Schema.Types.ObjectId, ref: 'Text' },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
    default: null
  },
  isReply: {
    type: Object,
    noteId: { type: Schema.Types.ObjectId, ref: 'Note' },
    // sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
    // textId: { type: Schema.Types.ObjectId, ref: 'Text' },
    default: null
  },
  projectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  //    children
  replies: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  //    connections
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

  votes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      userReputation: { type: Number },
      bill: { type: Number }
    }
  ], //maybe this should be a server thing, thats just transimitting the plain result to the client

  // meta
  created: { type: Date, default: null },
  lastEdited: { type: Date, default: null },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: false }
});

module.exports = Note = mongoose.model('Note', schema);
