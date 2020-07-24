const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//  npm install mongoose-unique-validator
// const mongooseUniqueValidator = require('mongoose-unique-validator')

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  noteIds: [{ type: Schema.Types.ObjectId, ref: 'Notes', default: [] }],
  textIds: [{ type: Schema.Types.ObjectId, ref: 'Text', default: [] }],
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section', default: [] }],
  accessedNoteIds: [{ type: Schema.Types.ObjectId, ref: 'Note', default: [] }],
  accessedTextIds: [{ type: Schema.Types.ObjectId, ref: 'Text', default: [] }],
  reputation: { type: Number, default: 0 }
});

// schema.plugin(mongooseUniqueValidator);

module.exports = User = mongoose.model('User', schema);
