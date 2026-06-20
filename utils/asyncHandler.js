/**
 * Wraps async route handlers to automatically catch errors
 * and pass them to Express error middleware.
 *
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
