'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
  text: String,
  file: String,
  created_at: String,
  user: { type: Schema.ObjectId, ref: 'User' },
});

export default mongoose.model('publication', PublicationSchema);
