const crudOps = require('../utils/crudOps')

const Codex = require('../models/codexModel')

exports.getAllCodexs = crudOps.getAll(Codex)
exports.getCodex = crudOps.getOne(Codex)
exports.createCodex = crudOps.createOne(Codex)
exports.updateCodex = crudOps.updateOne(Codex)
exports.deleteCodex = crudOps.deleteOne(Codex)
