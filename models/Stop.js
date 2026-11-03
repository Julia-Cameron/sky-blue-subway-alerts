const mongoose = require('mongoose');
const {MODES} =require('../config/Constant')

const stopSchema = new Schema(
    {
  name: { type: String, required: true, trim: true },
  mode: { type: String, required: true, enum :MODES },
  location: {
    type: { type: String, enum : ['Point'] ,default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  }}
);
// Allows text-search queries on station names
stopSchema.index({ name: 'text' });
module.exports = mongoose.model('Stop',stopSchema);