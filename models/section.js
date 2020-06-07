const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String },
  categoryIds: [{ type: String }],
  annotationIds: [{ type: Schema.Types.ObjectId, ref: 'annotation' }],
  begin: { type: Number },
  end: { type: Number },
  fullWords: { type: String },
  textId: { type: Schema.Types.ObjectId, ref: 'Text' },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = Section = mongoose.model('sections', schema);
