const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ancestrySchema = new Schema({
  ancestryName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
    default: 30,
  },
  origins: {
    type: String,
    default: '',
  },
  lifeSpan: {
    type: String,
    required: true,
  },
  image: String,
})

const Ancestry = mongoose.model('Ancestry', ancestrySchema)

module.exports = Ancestry
