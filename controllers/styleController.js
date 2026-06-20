const Style = require('../models/Style')
const { cloudinary } = require('../config/cloudinary')

exports.getStyles = async (req, res) => {
  try {
    const { search, category, occasion, fabric, minRating, sort, page = 1, limit = 12, featured } = req.query
    const query = {}
    if (search) query.$text = { $search: search }
    if (category && category !== 'All') query.category = category
    if (occasion && occasion !== 'All') query.occasion = occasion
    if (fabric && fabric !== 'All') query.fabric = fabric
    if (minRating) query.averageRating = { $gte: parseFloat(minRating) }
    if (featured === 'true') query.featured = true

    let sortObj = { createdAt: -1 }
    if (sort === 'trending') sortObj = { viewCount: -1, createdAt: -1 }
    if (sort === 'rating') sortObj = { averageRating: -1, reviewCount: -1 }
    if (sort === 'price_asc') sortObj = { price: 1 }
    if (sort === 'price_desc') sortObj = { price: -1 }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [styles, total] = await Promise.all([
      Style.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Style.countDocuments(query)
    ])
    res.json({ styles, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getStyle = async (req, res) => {
  try {
    const style = await Style.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true })
    if (!style) return res.status(404).json({ message: 'Style not found' })
    const similar = await Style.find({ category: style.category, _id: { $ne: style._id } })
      .sort({ averageRating: -1 }).limit(4)
    res.json({ style, similar })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.createStyle = async (req, res) => {
  try {
    const { title, description, category, fabric, occasion, price, featured } = req.body
    const images = req.files ? req.files.map(f => f.path) : []
    const style = await Style.create({ title, description, category, fabric, occasion, price, featured: featured === 'true', images })
    res.status(201).json({ style })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.updateStyle = async (req, res) => {
  try {
    const { title, description, category, fabric, occasion, price, featured, existingImages } = req.body
    const newImages = req.files ? req.files.map(f => f.path) : []
    const kept = Array.isArray(existingImages) ? existingImages : existingImages ? [existingImages] : []
    const images = [...kept, ...newImages]
    const style = await Style.findByIdAndUpdate(
      req.params.id,
      { title, description, category, fabric, occasion, price, featured: featured === 'true', images },
      { new: true, runValidators: true }
    )
    if (!style) return res.status(404).json({ message: 'Style not found' })
    res.json({ style })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.deleteStyle = async (req, res) => {
  try {
    const style = await Style.findByIdAndDelete(req.params.id)
    if (!style) return res.status(404).json({ message: 'Style not found' })
    // Delete images from Cloudinary
    for (const img of style.images) {
      const publicId = img.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(`aura-scarves/${publicId}`).catch(() => {})
    }
    res.json({ message: 'Style deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
