const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const addToCodex = require('../middleware/addToCodex')

const campaignSchema = new Schema({
  campaignName: {
    type: String,
    required: true,
    unique: true,
  },
  players: [
    {
      player: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      character: {
        type: Schema.Types.ObjectId,
        ref: 'PlayerCharacter',
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
})

// mongoose.plugin(addToCodex, 'campaigns')

const Campaign = mongoose.model('Campaign', campaignSchema)

module.exports = Campaign
