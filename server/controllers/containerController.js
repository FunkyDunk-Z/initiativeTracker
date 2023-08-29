const crudOps = require('../utils/crudOps')

const Container = require('../models/containerModel')

exports.getAllContainers = crudOps.getAll(Container)
exports.getContainer = crudOps.getOne(Container)
exports.createContainer = crudOps.createOne(Container)
exports.updateContainer = crudOps.updateOne(Container)
exports.deleteContainer = crudOps.deleteOne(Container)
