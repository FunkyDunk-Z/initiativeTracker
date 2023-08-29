const crudOps = require('../utils/crudOps')

const Campaign = require('../models/campaignModel')

exports.getAllCampaigns = crudOps.getAll(Campaign)
exports.getCampaign = crudOps.getOne(Campaign)
exports.createCampaign = crudOps.createOne(Campaign)
exports.updateCampaign = crudOps.updateOne(Campaign)
exports.deleteCampaign = crudOps.deleteOne(Campaign)
