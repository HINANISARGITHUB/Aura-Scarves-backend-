const mongoose = require('mongoose')
const Style = require('./Style')

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  style: { type: mongoose.Schema.Types.ObjectId, ref: 'Style', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, maxlength: 500 },
}, { timestamps: true })

reviewSchema.index({ style: 1, user: 1 }, { unique: true })

// Update style average rating after save/delete
async function updateStyleRating(styleId) {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { style: styleId } },
    { $group: { _id: '$style', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ])
  if (stats.length > 0) {
    await Style.findByIdAndUpdate(styleId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    })
  } else {
    await Style.findByIdAndUpdate(styleId, { averageRating: 0, reviewCount: 0 })
  }
}

reviewSchema.post('save', function () { updateStyleRating(this.style) })
reviewSchema.post('deleteOne', { document: true }, function () { updateStyleRating(this.style) })
reviewSchema.post('findOneAndDelete', function (doc) { if (doc) updateStyleRating(doc.style) })

module.exports = mongoose.model('Review', reviewSchema)
