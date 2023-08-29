const User = require('../models/userModel')
const Codex = require('../models/codexModel')

const removeFromCodex = function (schema, field) {
  schema.pre('deleteOne', async function (next) {
    if (!(await User.findById(this.createdBy))) {
      next()
    }
    const { codex } = await User.findById(this.createdBy)

    const userCodex = await Codex.findById(codex)

    if (userCodex) {
      console.log(userCodex, field, this._id)
      userCodex[field].removeFromSet(this._id)
      await userCodex.save()
    }

    next()
  })
}

module.exports = removeFromCodex
