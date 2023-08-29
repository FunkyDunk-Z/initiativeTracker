const mongoose = require('mongoose')
const baseItem = require('./baseItemModel')

const Schema = mongoose.Schema

const categoryEnum = [
  'pouch',
  'small backpack',
  'large backpack',
  'small chest',
  'medium chest',
  'large chest',
  'small safe',
  'medium safe',
  'large safe',
  'industrial container',
]

const containerSchema = Schema({
  ...baseItem.obj,
  category: {
    type: String,
    enum: categoryEnum,
  },
  maxCapacity: {
    type: Number,
  },
  currentCapacity: {
    type: Number,
    default: 0,
  },
  contents: [
    {
      type: Schema.ObjectId,
      ref: 'Weapon',
    },
    {
      type: Schema.ObjectId,
      ref: 'Armour',
    },
    {
      type: Schema.ObjectId,
      ref: 'Shield',
    },
    {
      type: Schema.ObjectId,
      ref: 'Apparel',
    },
    {
      type: Schema.ObjectId,
      ref: 'Resource',
    },
    {
      type: Schema.ObjectId,
      ref: 'Alchemy',
    },
    {
      type: Schema.ObjectId,
      ref: 'Item',
    },
  ],
})

const Container = mongoose.model('Container', containerSchema)

module.exports = Container
