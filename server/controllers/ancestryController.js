const crudOps = require('../utils/crudOps')

const Ancestry = require('../models/ancestryModel')

exports.getAllAncestrys = crudOps.getAll(Ancestry)
exports.getAncestry = crudOps.getOne(Ancestry)
exports.createAncestry = crudOps.createOne(Ancestry)
exports.updateAncestry = crudOps.updateOne(Ancestry)
exports.deleteAncestry = crudOps.deleteOne(Ancestry)
