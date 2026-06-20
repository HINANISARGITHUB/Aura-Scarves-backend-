const Review = require('../models/Review')
const Style = require('../models/Style')

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ style: req.params.styleId })
      .populate('user', 'name').sort({ createdAt: -1 })
    res.json({ reviews })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getRecentReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('style', 'title')
      .sort({ createdAt: -1 }).limit(limit)
    res.json({ reviews })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const exists = await Review.findOne({ user: req.user._id, style: req.params.styleId })
    if (exists) return res.status(400).json({ message: 'You have already reviewed this style' })
    const style = await Style.findById(req.params.styleId)
    if (!style) return res.status(404).json({ message: 'Style not found' })
    const review = await Review.create({ user: req.user._id, style: req.params.styleId, rating, comment })
    await review.populate('user', 'name')
    res.status(201).json({ review })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id })
    if (!review) return res.status(404).json({ message: 'Review not found or not yours' })
    review.rating = req.body.rating || review.rating
    review.comment = req.body.comment || review.comment
    await review.save()
    await review.populate('user', 'name')
    res.json({ review })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id })
    if (!review) return res.status(404).json({ message: 'Review not found or not yours' })
    await review.deleteOne()
    res.json({ message: 'Review deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
