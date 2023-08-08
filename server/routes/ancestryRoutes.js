const express = require('express')
const ancestryController = require('../controllers/ancestryController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(ancestryController.getAllAncestrys)
  .post(ancestryController.createAncestry)

router
  .route('/:id')
  .get(ancestryController.getAncestry)
  .patch(ancestryController.updateAncestry)
  .delete(ancestryController.deleteAncestry)

module.exports = router
