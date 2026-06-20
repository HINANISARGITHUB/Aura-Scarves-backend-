require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const { globalErrorHandler } = require('./utils/errorHandler')

const app = express()

// Connect DB
connectDB()

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/styles', require('./routes/styles'))
app.use('/api/reviews', require('./routes/reviews'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/favorites', require('./routes/favorites'))
app.use('/api/admin', require('./routes/admin'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Aura Scarves API running ✨' }))

// 404
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }))

// Global error handler
app.use(globalErrorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Aura Scarves server running on port ${PORT}`))

