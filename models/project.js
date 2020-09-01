const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  delta: { type: Object, default: { op: [{ insert: '\n' }] } },
  plainText: { type: String, default: '' },

  // Links
  //    parents
  projectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }], // shall you be able to stack projects? // be aware of loops.
  //    children
  textIds: [{ type: Schema.Types.ObjectId, ref: 'Text', default: [] }],
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section', default: [] }],
  noteIds: [{ type: Schema.Types.ObjectId, ref: 'Notes', default: [] }],
  //    connections
  directConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section | project
    }
  ],
  indirectConnections: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section | project
    }
  ],

  // meta
  created: { type: Date, default: null },
  ownerIds: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  followerIds: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  accessFor: [{ type: Schema.Types.ObjectId, default: [] }], // ref: 'User' or 'Group'
  isPublic: { type: Boolean, default: false }
});

module.exports = Project = mongoose.model('Project', schema);
