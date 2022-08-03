import { Application } from 'express'
import { create, index, remove, show, update } from '../controllers/product.controller'
import { verifyAuthToken } from '../middlewares/auth.middleware'

const productRouter = (app: Application) => {
  app.get('/products', index)
  app.get('/products/:id(\\d+)', show)
  app.post('/products', verifyAuthToken, create)
  app.put('/products/:id', verifyAuthToken, update)
  app.delete('/products/:id', verifyAuthToken, remove)
}

export default productRouter
