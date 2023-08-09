const User = require('../models/userModel')
const crudOps = require('../utils/crudOps')
const AppError = require('../utils/appError')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getMyAccount = async (req, res, next) => {
  req.params.id = req.user.id

  next()
}

exports.updateMyAccount = async (req, res, next) => {
  if (req.body.password || req.body.password) {
    return next(new AppError('Please use update my password', 400))
  }

  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'username',
    'email'
  )

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    user: updatedUser.getUserInfo(),
  })
}

exports.deleteMyAccount = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null,
  })
}

exports.getUser = async (req, res, next) => {
  try {
    const query = User.findById(req.params.id)

    const user = await query.populate({
      path: 'codex',
      select: '-__v -user',
    })

    if (!user) {
      return next(new AppError('No Document found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: user.getUserInfo(),
    })
  } catch (error) {
    console.error(error)
    return next()
  }
}

exports.createUser = crudOps.createOne(User)
exports.getAllUsers = crudOps.getAll(User)
// exports.getUser = crudOps.getOne(User)
exports.updateUser = crudOps.updateOne(User)
exports.deleteUser = crudOps.deleteOne(User)
