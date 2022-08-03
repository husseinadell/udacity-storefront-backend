import { Application } from 'express'
import { create, index, login, show, update } from '../controllers/user.controller'
import { verifyAuthToken } from '../middlewares/auth.middleware'

const userRouter = (app: Application) => {
  app.get('/users', verifyAuthToken, index)
  app.get('/users/:id', verifyAuthToken, show)
  app.post('/users', create)
  app.post('/users/login', login)
  app.put('/users/:id', update)
}

export default userRouter
