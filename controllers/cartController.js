const Cart = require('../models/Cart')

const populateCart = (cart) => cart.populate({ path: 'items.style', select: 'title price images category fabric' })

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) { cart = await Cart.create({ user: req.user._id, items: [] }) }
    await populateCart(cart)
    res.json({ items: cart.items })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.addToCart = async (req, res) => {
  try {
    const { styleId, quantity = 1 } = req.body
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] })
    const existingItem = cart.items.find(i => i.style.toString() === styleId)
    if (existingItem) existingItem.quantity += quantity
    else cart.items.push({ style: styleId, quantity })
    await cart.save()
    await populateCart(cart)
    res.json({ items: cart.items })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.updateQuantity = async (req, res) => {
  try {
    const { styleId, quantity } = req.body
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })
    const item = cart.items.find(i => i.style.toString() === styleId)
    if (!item) return res.status(404).json({ message: 'Item not in cart' })
    if (quantity <= 0) cart.items = cart.items.filter(i => i.style.toString() !== styleId)
    else item.quantity = quantity
    await cart.save()
    await populateCart(cart)
    res.json({ items: cart.items })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })
    cart.items = cart.items.filter(i => i.style.toString() !== req.params.styleId)
    await cart.save()
    await populateCart(cart)
    res.json({ items: cart.items })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] })
    res.json({ message: 'Cart cleared' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
