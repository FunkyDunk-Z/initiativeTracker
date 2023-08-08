const express = require('express')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/sign-up', authController.signUp)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/isLoggedIn', authController.isLoggedIn)

router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

router.use('/', authController.protect)

router.get('/my-account', userController.getMyAccount, userController.getUser)
router.patch('/update-my-password', authController.updatePassword)
router.patch('/update-my-account', userController.updateMyAccount)
router.delete('/delete-my-account', userController.deleteMyAccount)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
