const express = require('express')
const campaignController = require('../controllers/campaignController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/campaign')
  .get(campaignController.getAllCampaigns)
  .post(campaignController.createCampaign)

router
  .route('/campaign/:id')
  .get(campaignController.getCampaign)
  .patch(campaignController.updateCampaign)
  .delete(campaignController.deleteCampaign)

module.exports = router
