import { Application } from 'express'
import {
  create,
  index,
  remove,
  show,
  showByCategory,
  update
} from '../controllers/product.controller'
import { verifyAuthToken } from '../middlewares/auth.middleware'

const productRouter = (app: Application) => {
  app.get('/products', verifyAuthToken, index)
  app.get('/products/:id(\\d+)', verifyAuthToken, show)
  app.get('/products/:category', verifyAuthToken, showByCategory)
  app.post('/products', create)
  app.put('/products/:id', update)
  app.delete('/products/:id', remove)
}

export default productRouter
