const router = require('express').Router()
const { getStyles, getStyle, createStyle, updateStyle, deleteStyle } = require('../controllers/styleController')
const { protect, adminOnly } = require('../middleware/auth')
const { upload } = require('../config/cloudinary')

router.get('/', getStyles)
router.get('/:id', getStyle)
router.post('/', protect, adminOnly, upload.array('images', 5), createStyle)
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateStyle)
router.delete('/:id', protect, adminOnly, deleteStyle)

module.exports = router
