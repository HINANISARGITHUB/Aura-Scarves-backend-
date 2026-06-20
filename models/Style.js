const mongoose = require('mongoose')

const styleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, enum: ['Casual', 'Formal', 'Occasion', 'Bridal', ' Printed', 'Plan'], default: 'Casual' },
  fabric: { type: String, enum: ['Chiffon', 'Jersey', 'Silk', 'Cotton', 'Satin', 'Crepe', 'Linen',], default: 'Chiffon' },
  occasion: { type: String, enum: ['Daily', 'Wedding', 'Office', 'Party', 'Religious','University','Business Meeting'], default: 'Daily' },
  images: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  featured: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true })

styleSchema.index({ title: 'text', description: 'text' })
styleSchema.index({ category: 1, occasion: 1, fabric: 1 })
styleSchema.index({ averageRating: -1, reviewCount: -1 })

module.exports = mongoose.model('Style', styleSchema)
