const express = require('express')
const containerController = require('../controllers/containerController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(containerController.getAllContainers)
  .post(containerController.createContainer)

router
  .route('/:id')
  .get(containerController.getContainer)
  .patch(containerController.updateContainer)
  .delete(containerController.deleteContainer)

module.exports = router
