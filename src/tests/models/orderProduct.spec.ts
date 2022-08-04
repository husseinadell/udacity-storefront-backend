import { OrderRepository, OrderStatus } from '../../models/order.model'
import { OrderProductRepository } from '../../models/orderProduct.model'
import { ProductRepository } from '../../models/product.model'
import { UserRepository } from '../../models/user.model'

const testOrderProductRepository = new OrderProductRepository()
const testOrderRepository = new OrderRepository()
const testProductRepository = new ProductRepository()
const testUserRepository = new UserRepository()

export type OrderProduct = {
  orderId?: number
  productId?: number
  quantity?: number
}

export type OrderProductWithInfo = {
  orderId?: number
  productId?: number
  quantity?: number
  name?: string
  price?: number
  category?: string
}
let productId1: number
let orderId: number
let userId: number

describe('Test orderProductRepository', (): void => {
  beforeAll(async (): Promise<void> => {
    const { id: p1 } = await testProductRepository.create({
      name: 'test product',
      price: 10,
      category: 'test'
    })
    productId1 = p1 as number
    const { id: u } = await testUserRepository.create({
      firstName: 'order',
      lastName: 'user',
      password: 'password',
      email: 'order.user@test.com'
    })
    userId = u as number
    const { id: o } = await testOrderRepository.create({
      userId: userId,
      status: OrderStatus.ACTIVE
    })
    orderId = o as number
  })
  it('should create an order_product', async (): Promise<void> => {
    const result: OrderProduct = await testOrderProductRepository.createOrderProduct({
      orderId: orderId,
      productId: productId1,
      quantity: 1
    })
    expect(result.orderId).toBe(orderId)
    expect(result.productId).toBe(productId1)
    expect(result.quantity).toBe(1)
  })
  it('should show order_products', async (): Promise<void> => {
    const result: OrderProduct[] = await testOrderProductRepository.showOrderProducts(orderId)
    expect(result).toHaveSize(1)
    expect(result[0].orderId).toBe(orderId)
    expect(result[0].productId).toBe(productId1)
    expect(result[0].quantity).toBe(1)
  })
  it('should show order_products info', async (): Promise<void> => {
    const result: OrderProductWithInfo[] = await testOrderProductRepository.showOrderProductsInfo(
      orderId
    )
    expect(result).toHaveSize(1)
    expect(result[0].orderId).toBe(orderId)
    expect(result[0].productId).toBe(productId1)
    expect(result[0].quantity).toBe(1)
    expect(result[0].name).toBe('test product')
    expect(result[0].price).toBe(10)
    expect(result[0].category).toBe('test')
  })
  afterAll(async (): Promise<void> => {
    await testProductRepository.remove(productId1)
    await testUserRepository.delete(userId)
    await testOrderRepository.delete(orderId)
  })
})
