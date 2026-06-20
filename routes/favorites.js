const router = require('express').Router()
const { getFavorites, getFavoritesWithDetails, addFavorite, removeFavorite } = require('../controllers/favoritesController')
const { protect } = require('../middleware/auth')

router.use(protect)
router.get('/', getFavorites)
router.get('/full', getFavoritesWithDetails)
router.post('/:styleId', addFavorite)
router.delete('/:styleId', removeFavorite)

module.exports = router
