const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  descriptionNoteIds: [
    { type: Schema.Types.ObjectId, ref: 'Notes', default: [] }
  ],

  ownerIds: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  followerIds: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  accessFor: [{ type: Schema.Types.ObjectId, default: [] }], // ref: 'User' or 'Group'
  isPublic: { type: Boolean, default: false },

  textIds: [{ type: Schema.Types.ObjectId, ref: 'Text', default: [] }],
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section', default: [] }],
  noteIds: [{ type: Schema.Types.ObjectId, ref: 'Notes', default: [] }]
});

module.exports = Project = mongoose.model('Project', schema);
