const mongoose = require('mongoose')

const Schema = mongoose.Schema

const codexSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  characters: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PlayerCharacter',
    },
  ],
  campaigns: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Campaigns',
    },
  ],
})

// codexSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'characters',
//     select: '-__v ',
//   })
//   next()
// })

const Codex = mongoose.model('Codex', codexSchema)

module.exports = Codex
