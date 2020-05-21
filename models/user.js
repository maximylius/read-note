const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//  npm install mongoose-unique-validator
// const mongooseUniqueValidator = require('mongoose-unique-validator')

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notebookIds: [{ type: Schema.Types.ObjectId, ref: 'Notebooks', default: [] }],
  textIds: [{ type: Schema.Types.ObjectId, ref: 'Text', default: [] }],
  sectionIds: [{ type: Schema.Types.ObjectId, ref: 'Section', default: [] }],
  annotationIds: [
    { type: Schema.Types.ObjectId, ref: 'Annotation', default: [] }
  ],
  accessedNotebookIds: [
    { type: Schema.Types.ObjectId, ref: 'Notebook', default: [] }
  ],
  accessedTextIds: [{ type: Schema.Types.ObjectId, ref: 'Text', default: [] }],
  reputation: { type: Number, default: 0 }
});

// schema.plugin(mongooseUniqueValidator);

module.exports = User = mongoose.model('User', schema);
