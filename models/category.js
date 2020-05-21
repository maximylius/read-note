const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  icon: { type: String },
  parent: { type: Schema.Types.ObjectId, ref: 'category' },
  children: [{ type: Schema.Types.ObjectId, ref: 'category' }],
  accessFor: [{ type: Schema.Types.ObjectId, ref: 'User' }] // if [] => public
});

module.exports = Categories = mongoose.model('category', schema);
