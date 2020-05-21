const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  type: { type: String }, // note, heading, annotation, tree, notebook, text
  textcontent: { type: String },
  divs: [
    {
      begin: { type: Number, required: true },
      end: { type: Number, required: true },
      div: { type: String, default: '' },
      fontWeight: { type: String, default: '' },
      textDecoration: { type: String, default: '' },
      color: { type: String, default: '' }
    }
  ],
  connectedWith: [{ type: Schema.Types.ObjectId }], // ref: 'Note' / 'Annotation' / 'tree' / 'notebook' / 'text' / ...
  created: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = Note = mongoose.model('notes', schema);
