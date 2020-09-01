const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//  npm install mongoose-unique-validator
// const mongooseUniqueValidator = require('mongoose-unique-validator')

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },

  projectIds: [{ type: Schema.Types.ObjectId, ref: 'Project', default: [] }], // [0] must be default project
  textIds: [{ type: Schema.Types.ObjectId, ref: 'Text', default: [] }],
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section', default: [] }],
  noteIds: [{ type: Schema.Types.ObjectId, ref: 'Notes', default: [] }],
  accessedTextIds: [{ type: Schema.Types.ObjectId, ref: 'Text', default: [] }],
  accessedNoteIds: [{ type: Schema.Types.ObjectId, ref: 'Note', default: [] }],
  groups: [{ type: Schema.Types.ObjectId }],
  favourites: [
    {
      resId: { type: Schema.Types.ObjectId },
      resType: { type: String } //note | text | section
    }
  ],
  reputation: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now() }
});

// schema.plugin(mongooseUniqueValidator);

module.exports = User = mongoose.model('User', schema);
