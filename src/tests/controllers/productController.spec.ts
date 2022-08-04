import supertest, { Response } from 'supertest'
import app from '../../index'
import { UserRepository } from '../../models/user.model'

type TestProduct = {
  id?: number
  name?: string
  price?: number
  category?: string
  createdAt?: Date
}

const request = supertest(app)

let authToken: string
let userId: number
let productId: number

describe('Product Controller', () => {
  beforeAll(async () => {
    const response: Response = await request.post('/users').send({
      firstName: 'test',
      lastName: 'api',
      password: 'password',
      email: 'test.api@test.com'
    })
    authToken = response.body.token
    userId = response.body.user.id
  })
  describe('POST /products', () => {
    it('should return a 401 status code', async () => {
      const response: Response = await request.post('/products')
      expect(response.status).toBe(401)
    })
    it('should return a 201 status code', async () => {
      const product: TestProduct = {
        name: 'test',
        price: 10,
        category: 'test'
      }
      const response: Response = await request
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(product)
      expect(response.status).toBe(201)
      expect(response.body.product.name).toBe(product.name)
      expect(response.body.product.price).toBe(product.price)
      expect(response.body.product.category).toBe(product.category)
      productId = response.body.product.id
    })
  })
  describe('GET /products', () => {
    it('should return a 200 status code and products list', async () => {
      const response: Response = await request.get('/products')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBeTrue()
      expect(response.body.length).toBeGreaterThan(0)
    })
  })
  describe('GET /products/:id', () => {
    it('should return a 200 status code and requested product', async () => {
      const response: Response = await request.get(`/products/${productId}`)
      expect(response.status).toBe(200)
      expect(response.body.id).toBe(productId)
    })
  })
  describe('PUT /products/:id', () => {
    it('should return a 401 status code', async () => {
      const response: Response = await request.put(`/products/${productId}`)
      expect(response.status).toBe(401)
    })
  })
  describe('DELETE /products', () => {
    it('should return a 401 status code', async () => {
      const response: Response = await request.delete(`/products/${productId}`)
      expect(response.status).toBe(401)
    })
    it('should return a 200 status code', async () => {
      const response: Response = await request
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
      expect(response.status).toBe(200)
    })
  })
  afterAll(async () => {
    const userRepository = new UserRepository()
    await userRepository.delete(userId)
  })
})
