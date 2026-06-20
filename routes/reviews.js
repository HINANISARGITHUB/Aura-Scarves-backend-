const router = require('express').Router()
const { getReviews, getRecentReviews, addReview, updateReview, deleteReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/auth')

router.get('/recent', getRecentReviews)
router.get('/:styleId', getReviews)
router.post('/:styleId', protect, addReview)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)

module.exports = router
