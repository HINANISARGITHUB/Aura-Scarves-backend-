const User = require('../models/User')
const Style = require('../models/Style')
const Review = require('../models/Review')

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password')
    res.json({ users })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getStats = async (req, res) => {
  try {
    const [totalStyles, totalUsers, totalReviews, ratingAgg] = await Promise.all([
      Style.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Review.countDocuments(),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }])
    ])
    res.json({
      totalStyles,
      totalUsers,
      totalReviews,
      avgRating: ratingAgg[0]?.avg || 0,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
