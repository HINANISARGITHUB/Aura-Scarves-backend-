const router = require('express').Router()
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect)
router.post('/', createOrder)
router.get('/my-orders', getMyOrders)
router.get('/:id', getOrderById)

// Admin routes
router.get('/', adminOnly, getAllOrders)
router.put('/:id/status', adminOnly, updateOrderStatus)

module.exports = router