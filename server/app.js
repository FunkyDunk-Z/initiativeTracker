const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const userRouter = require('./routes/userRoutes')
const ancestryRouter = require('./routes/ancestryRoutes')
const characterRouter = require('./routes/characterRoutes')
const codexRouter = require('./routes/codexRoutes')

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/ancestry', ancestryRouter)
app.use('/api/v1/character', characterRouter)
app.use('/api/v1/codex', codexRouter)

module.exports = app
