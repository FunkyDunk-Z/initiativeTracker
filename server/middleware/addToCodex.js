const User = require('../models/userModel')
const Codex = require('../models/codexModel')

const addToCodex = function (schema, field) {
  schema.pre('save', async function (next) {
    if (!(await User.findById(this.createdBy))) {
      next()
    }
    const { codex } = await User.findById(this.createdBy)

    const userCodex = await Codex.findById(codex)

    if (userCodex) {
      userCodex[field].addToSet(this._id)
      await userCodex.save()
    }

    next()
  })
}

module.exports = addToCodex
