const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  style: { type: mongoose.Schema.Types.ObjectId, ref: 'Style', required: true },
  title: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)