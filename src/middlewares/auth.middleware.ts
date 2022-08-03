import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET as Secret
export const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization as string
    const token = authHeader.split(' ')[1]
    res.locals.user = await jwt.verify(token, JWT_SECRET)
    next()
  } catch (error) {
    res.status(401).send({ error: 'Invalid token' })
  }
}
