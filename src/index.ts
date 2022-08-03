import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import userRouter from './routes/user.route'
import productRouter from './routes/product.route'
import orderRouter from './routes/order.route'

dotenv.config()

const PORT = process.env.PORT || 3000
// create an instance server
const app: Application = express()
// HTTP request logger middleware
app.use(morgan('short'))
app.use(express.json())

// add routing for / path
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World 🌍'
  })
})

userRouter(app)
productRouter(app)
orderRouter(app)
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found',
    error: {
      message: 'You reached a route that is not defined on this server'
    }
  })
})

// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at prot:${PORT}`)
})

export default app
