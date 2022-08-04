import client from '../database'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
const { BCRYPT_SALT_ROUNDS, BCRYPT_PASSWORD } = process.env

export type User = {
  id?: number
  firstName: string
  lastName: string
  password: string
  email: string
  createdAt?: Date
}

export type UserResponse = {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: Date
}

export type UserUpdate = {
  id: number
  firstName?: string
  lastName?: string
  password?: string
}

export class UserRepository {
  async index(): Promise<UserResponse[]> {
    try {
      const conn = await client.connect()
      const sql = 'select id, "firstName", "lastName", email, "createdAt" from users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (error) {
      throw new Error(`Couldn't get users because of ${error}`)
    }
  }

  async show(id: number): Promise<UserResponse> {
    try {
      const conn = await client.connect()
      const sql = 'select id, "firstName", "lastName", email, "createdAt" from users where id = $1'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't get user because of ${error}`)
    }
  }

  async login(email: string, password: string): Promise<UserResponse | null> {
    try {
      const conn = await client.connect()
      const sql = 'select * from users where email = $1'
      const result = await conn.query(sql, [email.toLowerCase()])
      conn.release()
      if (result.rows.length === 0) {
        return null
      }
      if (bcrypt.compareSync(password + BCRYPT_PASSWORD, result.rows[0].password)) {
        delete result.rows[0].password
        return result.rows[0]
      } else {
        return null
      }
    } catch (error) {
      throw new Error(`Couldn't get user because of ${error}`)
    }
  }

  async create(user: User): Promise<UserResponse> {
    try {
      const conn = await client.connect()
      const hashedPassword = await bcrypt.hash(
        user.password + BCRYPT_PASSWORD,
        parseInt(BCRYPT_SALT_ROUNDS as string)
      )
      const sql = `
        insert into users ("firstName", "lastName", email, password) 
        values ($1, $2, $3, $4) 
        returning id, "firstName", "lastName", email, "createdAt"`
      const result = await conn.query(sql, [
        user.firstName,
        user.lastName,
        user.email.toLowerCase(),
        hashedPassword
      ])
      conn.release()
      return result.rows[0]
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      if (error.code === '23505' && error.constraint === 'users_email_key') {
        throw new Error(`duplicate key value violates unique constraint`)
      }
      throw new Error(`Couldn't create user because of ${error}`)
    }
  }

  async update(user: UserUpdate): Promise<UserResponse> {
    try {
      const conn = await client.connect()
      const sql = `
        update users set "firstName" = $1, "lastName" = $2 
        where id = $3
        returning id, "firstName", "lastName", email, "createdAt"`
      const result = await conn.query(sql, [user.firstName, user.lastName, user.id])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't update user because of ${error}`)
    }
  }

  async delete(id: number): Promise<UserResponse> {
    try {
      const conn = await client.connect()
      const sql = `
        delete from users where id = $1
        returning id, "firstName", "lastName", email, "createdAt"`
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't delete user because of ${error}`)
    }
  }
}
