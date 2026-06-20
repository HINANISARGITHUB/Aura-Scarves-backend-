const router = require('express').Router()
const { getCart, addToCart, updateQuantity, removeFromCart, clearCart } = require('../controllers/cartController')
const { protect } = require('../middleware/auth')

router.use(protect)
router.get('/', getCart)
router.post('/add', addToCart)
router.put('/update', updateQuantity)
router.delete('/clear', clearCart)
router.delete('/remove/:styleId', removeFromCart)

module.exports = router
