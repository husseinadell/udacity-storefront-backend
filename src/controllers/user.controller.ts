import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { UserUpdate, UserRepository, UserResponse, User } from '../models/user.model'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET as Secret
const userRepository = new UserRepository()

export const create = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, password, email } = req.body as unknown as User
    if (!firstName || !lastName || !password || !email) {
      res.status(400).json({ error: 'Missing required fields' })
    }
    const user: User = {
      firstName,
      lastName,
      password,
      email
    }
    const newUser = await userRepository.create(user)
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET)
    res.json({ user: newUser, token })
    // TBD: remove any and replace with proper type
  } catch (error: any) {
    if (error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(400).json({ error: 'Email already in use' })
    }
    return res.status(500).json({ error: error })
  }
}

export const index = async (_: Request, res: Response) => {
  try {
    const users: UserResponse[] = await userRepository.index()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const show = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as unknown as number
    const users: UserResponse = await userRepository.show(userId)
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as unknown as number

    const userUpdate: UserUpdate = {
      id: userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
    if (!userUpdate.firstName || !userUpdate.lastName) {
      return res
        .status(400)
        .json({ error: 'Missing required fields, firstName and lastName are both needed' })
    }
    const user = await userRepository.update(userUpdate)
    res.json(user)
  } catch (error) {
    console.log(error)

    res.status(500).json({ error: error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email as unknown as string
    const password = req.body.password as unknown as string

    const user: UserResponse | null = await userRepository.login(email, password)
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET)
    return res.json({ user, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}
