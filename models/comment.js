const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  // content
  delta: { type: Object, default: { op: [{ insert: '\n' }] } },
  plainText: { type: String, default: '' },

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
  votes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      userReputation: { type: Number },
      bill: { type: Number }
    }
  ],

  // meta
  created: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true }
});

module.exports = Comment = mongoose.model('Comment', schema);
