const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  type: { type: String, default: '' },
  textcontent: { type: String, default: '' },
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
  editedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }] // if [] => public
});

module.exports = Annotations = mongoose.model('annotation', schema);
