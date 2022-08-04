import supertest, { Response } from 'supertest'
import app from '../../index'
import { UserRepository } from '../../models/user.model'

type TestUser = {
  id?: number
  firstName?: string
  lastName?: string
  password?: string
  email?: string
  createdAt?: Date
}

const request = supertest(app)
let authToken: string
let userId: number

describe('User Controller', () => {
  describe('POST /users', () => {
    it('should return a 201 status code', async () => {
      const user: TestUser = {
        firstName: 'test',
        lastName: 'api',
        password: 'password',
        email: 'test.api@test.com'
      }
      const response: Response = await request.post('/users').send(user)
      expect(response.status).toBe(201)
      expect(response.body.user.firstName).toBe(user.firstName)
      expect(response.body.user.lastName).toBe(user.lastName)
      expect(response.body.user.email).toBe(user.email)
      expect(response.body.token).toBeDefined()
      authToken = response.body.token
      userId = response.body.user.id
    })

    it('should return a 400 status code', async () => {
      const response: Response = await request.post('/users')
      expect(response.status).toBe(400)
    })
  })
  describe('GET /users', () => {
    it('should return a 401 status code invalid token', async () => {
      const response: Response = await request.get('/users')
      expect(response.status).toBe(401)
    })

    it('should return a 200 status code', async () => {
      const response: Response = await request
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBeTrue()
      expect(response.body.length).toBeGreaterThan(0)
    })
  })

  describe('GET /users/:id', () => {
    it('should return a 401 status code invalid token', async () => {
      const response: Response = await request.get(`/users/${userId}`)
      expect(response.status).toBe(401)
    })

    it('should return a 200 status code', async () => {
      const response: Response = await request
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
      expect(response.status).toBe(200)
      expect(response.body).toBeDefined()
    })
  })

  describe('PUT /users/:id', () => {
    it('should return a 400 status code', async () => {
      const user: TestUser = {
        firstName: 'test'
      }
      const response: Response = await request.put(`/users/${userId}`).send(user)
      expect(response.status).toBe(400)
    })
    it('should return a 200 status code', async () => {
      const user: TestUser = {
        firstName: 'test',
        lastName: 'api'
      }
      const response: Response = await request.put(`/users/${userId}`).send(user)
      expect(response.status).toBe(200)
      expect(response.body.firstName).toBe(user.firstName)
      expect(response.body.lastName).toBe(user.lastName)
    })
  })

  describe('post /users/login', () => {
    it('should return a 400 status code invalid token', async () => {
      const user: TestUser = {
        password: 'password1',
        email: 'test.api@test.com'
      }
      const response: Response = await request.post('/users/login').send(user)
      expect(response.status).toBe(400)
    })

    it('should return a 200 status code', async () => {
      const user: TestUser = {
        password: 'password',
        email: 'test.api@test.com'
      }
      const response: Response = await request.post('/users/login').send(user)
      expect(response.status).toBe(200)
      expect(response.body.token).toBeDefined()
    })
  })
  afterAll(async () => {
    const userRepository = new UserRepository()
    await userRepository.delete(userId)
  })
})
