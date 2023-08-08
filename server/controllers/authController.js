const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const AppError = require('../utils/appError')
const Email = require('../utils/email')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '90d' })
}

// ----------Sign Up -----------

const signUp = async (req, res, next) => {
  const { firstName, lastName, email, username, password, passwordConfirm } =
    req.body
  if (
    !firstName ||
    !lastName ||
    !email ||
    !username ||
    !password ||
    !passwordConfirm
  ) {
    return res.status(400).json({ message: 'Please fill out all fields' })
  }

  try {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    })

    const accessToken = createToken(newUser.id)

    res.cookie('jwt', accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    const url = `${req.protocol}://${req.get('host')}/dashboard`
    const message = 'Welcome to a World Building App !'

    await new Email(newUser, url, message).sendWelcome()

    res.status(201).json({
      status: 'success',
      accessToken,
      data: {
        user: newUser.getUserInfo(),
      },
    })
  } catch (error) {
    return next(new AppError(error))
  }
}

// ----------Login----------

const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    user.password = undefined

    const accessToken = createToken(user.id)

    res.cookie('jwt', accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    res.status(200).json({
      status: 'success',
      accessToken,
      data: {
        user: user.getUserInfo(),
      },
    })
  } catch (error) {
    console.log('Error during user retrieval:', error)
  }
}

// ----------Is Logged In ? ----------

const isLoggedIn = async (req, res, next) => {
  try {
    let token

    if (req.cookies.jwt) {
      token = req.cookies.jwt
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'User not logged in' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded)

    res.status(200).json({
      status: 'success',
      data: {
        user: user.getUserInfo(),
      },
    })
  } catch (error) {
    return next()
  }
}

// ----------Logout----------

const logout = (req, res, next) => {
  res.clearCookie('jwt')

  res.status(200).json({ message: 'Logged Out' })
}

// ----------Protect-----------

const protect = async (req, res, next) => {
  try {
    let token

    if (req.cookies.jwt) {
      token = req.cookies.jwt
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const currentUser = await User.findById(decoded._id)

    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' })
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ message: 'Please log in again' })
    }

    req.user = currentUser

    next()
  } catch (error) {
    console.error(error)
  }
}

// ----------Forgot Password----------

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next()
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

  try {
    await new Email(user, resetURL, message).sendPasswordReset()

    res.status(200).json({
      status: 'success',
      message: 'Link sent to email',
    })
  } catch (error) {
    console.error(error)
    user.passwordResetToken = undefined
    user.passwordResetExpiresIn = undefined
    await user.save({ validateBeforeSave: false })

    return next()
  }
}

//----------Reset Password----------

const resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  })

  if (!user) {
    console.log('No User')
    return next()
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpiresIn = undefined

  await user.save()

  const accessToken = createToken(user.id)

  res.cookie('jwt', accessToken, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })

  res.status(200).json({
    status: 'success',
    accessToken,
    data: {
      user,
    },
  })
}

//----------Update Password----------

const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password')

    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return res.status(401).json({ message: 'Current password is Invalid' })
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(401).json({ message: 'Passwords do not match' })
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    const accessToken = createToken(user.id)

    res.cookie('jwt', accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })

    res.status(200).json({
      status: 'success',
      accessToken,
      data: {
        user,
      },
    })
  } catch (error) {
    return next(new AppError(error))
  }
}

module.exports = {
  signUp,
  login,
  logout,
  isLoggedIn,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
}
