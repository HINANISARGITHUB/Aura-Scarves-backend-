const router = require('express').Router()
const { getStats, getUsers } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect, adminOnly)
router.get('/stats', getStats)
router.get('/users', getUsers)

module.exports = router
