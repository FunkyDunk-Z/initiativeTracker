const crudOps = require('../utils/crudOps')

const Character = require('../models/characterModel')

exports.getAllCharacters = crudOps.getAll(Character)
exports.getCharacter = crudOps.getOne(Character)
exports.createCharacter = crudOps.createOne(Character)
exports.updateCharacter = crudOps.updateOne(Character)
exports.deleteCharacter = crudOps.deleteOne(Character)
