const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' })

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already in use' })
    const user = await User.create({ name, email, password })
    const token = signToken(user._id)
    res.status(201).json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })
    const token = signToken(user._id)
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getProfile = async (req, res) => {
  res.json({ user: req.user })
}

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
