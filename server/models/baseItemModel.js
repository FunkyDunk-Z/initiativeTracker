const mongoose = require('mongoose')

const Schema = mongoose.Schema

const qualityTypes = ['junk', 'average', 'good', 'great', 'amazing', 'perfect']

const rarityTypes = ['common', 'uncommon', 'rare', 'legendary', 'mythical']

const baseItemSchema = Schema({
  itemName: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
  },
  isArcane: {
    type: Boolean,
    deafult: false,
  },
  arcaneInfusion: {
    type: Schema.ObjectId,
    ref: 'ArcaneInfusion',
  },
  maxStackSize: {
    type: Number,
    default: 1,
  },
  weight: {
    type: Number,
    required: true,
  },
  quality: {
    type: String,
    enum: qualityTypes,
  },
  rarity: {
    type: String,
    enum: rarityTypes,
  },
  baseValue: {
    type: Number,
  },
})

const BaseItem = mongoose.model('Base Item', baseItemSchema)

module.exports = BaseItem
