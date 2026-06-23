const Order = require('../models/Order')

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingInfo } = req.body
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' })

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingInfo,
    })

    res.status(201).json({ order })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin only
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}