import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { UserUpdate, UserRepository, UserResponse, User } from '../models/user.model'
import dotenv from 'dotenv'
import { validateEmail } from '../utils'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET as Secret
const userRepository = new UserRepository()

export const create = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, password, email } = req.body as unknown as User
    if (!firstName || !lastName || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid Email' })
    }
    const user: User = {
      firstName,
      lastName,
      password,
      email
    }
    const newUser = await userRepository.create(user)
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET)
    res.status(201).json({ user: newUser, token })
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

export const show = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as unknown as number
    const users: UserResponse = await userRepository.show(userId)
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ error: error })
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
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ error: error })
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
    const token = jwt.sign({ ...user }, JWT_SECRET)
    return res.json({ user, token })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}
