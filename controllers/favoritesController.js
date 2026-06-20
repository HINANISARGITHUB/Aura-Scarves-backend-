const User = require('../models/User')

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites')
    res.json({ favorites: user.favorites })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getFavoritesWithDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites')
    res.json({ favorites: user.favorites })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.addFavorite = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: req.params.styleId } })
    res.json({ message: 'Added to favorites' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.removeFavorite = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.params.styleId } })
    res.json({ message: 'Removed from favorites' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
