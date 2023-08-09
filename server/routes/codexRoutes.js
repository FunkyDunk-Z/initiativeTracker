const express = require('express')
const codexController = require('../controllers/codexController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(codexController.getAllCodexs)
  .post(codexController.createCodex)

router
  .route('/:id')
  .get(codexController.getCodex)
  .post(codexController.updateCodex)
  .delete(codexController.deleteCodex)

module.exports = router
