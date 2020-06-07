const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String },
  deltas: [{ type: Object }],
  annotations: [
    {
      type: Object,
      annotationId: { type: Schema.Types.ObjectId, ref: 'annotation' },
      version: { type: String },
      plainText: { type: String }
    }
  ],
  keywords: [{ type: String }],
  created: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = Notebook = mongoose.model('Notebook', schema);
