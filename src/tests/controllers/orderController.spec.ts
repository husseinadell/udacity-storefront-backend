import supertest, { Response } from 'supertest'
import app from '../../index'
import { OrderStatus } from '../../models/order.model'
import { ProductRepository } from '../../models/product.model'
import { UserRepository } from '../../models/user.model'

const request = supertest(app)
const testProductRepository = new ProductRepository()
const testUserRepository = new UserRepository()

let authToken: string
let userId: number
let productId1: number
let productId2: number
let orderId: number

describe('Order Controller', () => {
  beforeAll(async (): Promise<void> => {
    const response: Response = await request.post('/users').send({
      firstName: 'test',
      lastName: 'api',
      password: 'password',
      email: 'test.api@test.com'
    })
    authToken = response.body.token
    userId = response.body.user.id
    const { id: p1 } = await testProductRepository.create({
      name: 'test product',
      price: 10,
      category: 'test'
    })
    const { id: p2 } = await testProductRepository.create({
      name: 'test product 2',
      price: 20,
      category: 'test2'
    })
    productId1 = p1 as number
    productId2 = p2 as number
  })
  describe('POST /orders', () => {
    it('should return a 401 status code', async () => {
      const response: Response = await request.post('/orders')
      expect(response.status).toBe(401)
    })
    it('should return a 201 status code', async () => {
      const response: Response = await request
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: OrderStatus.ACTIVE,
          products: [
            {
              productId: productId1,
              quantity: 1
            }
          ]
        })
      expect(response.status).toBe(201)
      expect(response.body.products[0].productId).toBe(productId1)
      expect(response.body.products[0].quantity).toBe(1)
      orderId = response.body.id
    })
  })
  describe('GET /orders', () => {
    it('should return a 401 status code', async () => {
      const response: Response = await request.get('/orders')
      expect(response.status).toBe(401)
    })
    it('should return a 200 status code and user orders list', async () => {
      const response: Response = await request
        .get('/orders')
        .set('Authorization', `Bearer ${authToken}`)
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBeTrue()
      expect(response.body.length).toBeGreaterThan(0)
    })
  })
  describe('GET /orders/recent', () => {
    it('should return a 401 status code', async () => {
      const response: Response = await request.get('/orders/recent')
      expect(response.status).toBe(401)
    })
    it('should return a 200 status code and user recent order', async () => {
      const response: Response = await request
        .get('/orders/recent')
        .set('Authorization', `Bearer ${authToken}`)
      expect(response.status).toBe(200)
      expect(response.body.id).toBe(orderId)
    })
  })
  describe('PUT /orders/:id', () => {
    it('should return a 401 status code', async () => {
      const response: Response = await request.put(`/orders/${productId1}`)
      expect(response.status).toBe(401)
    })
    it('should return a 200 status code and updated order', async () => {
      const response: Response = await request
        .put(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: OrderStatus.COMPLETE,
          products: [
            {
              productId: productId2,
              quantity: 2
            }
          ]
        })
      expect(response.status).toBe(200)
      expect(response.body.products[0].productId).toBe(productId1)
      expect(response.body.products[0].quantity).toBe(1)
      expect(response.body.products[1].productId).toBe(productId2)
      expect(response.body.products[1].quantity).toBe(2)
      expect(response.body.status).toBe(OrderStatus.COMPLETE)
    })
  })
  afterAll(async (): Promise<void> => {
    await testProductRepository.remove(productId1)
    await testProductRepository.remove(productId2)
    await testUserRepository.delete(userId)
  })
})
