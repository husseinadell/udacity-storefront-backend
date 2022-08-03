import { Application } from 'express'
import {
  create,
  showUserCurrentOrder,
  showUserOrders,
  update
} from '../controllers/order.controller'
import { verifyAuthToken } from '../middlewares/auth.middleware'

const orderRouter = (app: Application) => {
  app.post('/orders', verifyAuthToken, create)
  app.get('/orders/', verifyAuthToken, showUserOrders)
  app.get('/orders/recent', verifyAuthToken, showUserCurrentOrder)
  app.put('/orders/:id', verifyAuthToken, update)
}

export default orderRouter
