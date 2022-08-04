import { OrderRepository, OrderStatus } from '../../models/order.model'
import { OrderProduct, OrderProductWithInfo } from '../../models/orderProduct.model'
import { ProductRepository } from '../../models/product.model'
import { UserRepository } from '../../models/user.model'

const testOrderRepository = new OrderRepository()
const testProductRepository = new ProductRepository()
const testUserRepository = new UserRepository()

export type TestOrder = {
  id?: number
  userId?: number
  status?: OrderStatus
  createdAt?: Date
  products?: OrderProduct[]
}

export type TestOrderWithProducts = {
  id?: number
  userId?: number
  status?: OrderStatus
  createdAt?: Date
  products?: OrderProductWithInfo[]
}
let productId1: number
let productId2: number
let userId: number
let orderId: number
let orderIdWithProducts: number

describe('Test OrderRepository', (): void => {
  beforeAll(async (): Promise<void> => {
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
    const { id } = await testUserRepository.create({
      firstName: 'order',
      lastName: 'user',
      password: 'password',
      email: 'order.user@test.com'
    })
    productId1 = p1 as number
    productId2 = p2 as number
    userId = id
  })
  it('should create an order', async (): Promise<void> => {
    const result: TestOrder = await testOrderRepository.create({
      userId,
      status: OrderStatus.ACTIVE
    })
    expect(result.userId).toBe(userId)
    expect(result.status).toBe(OrderStatus.ACTIVE)
    expect(result.products).toHaveSize(0)
    orderId = result.id as number
  })
  it('should create an order with products', async (): Promise<void> => {
    const result: TestOrder = await testOrderRepository.create({
      userId,
      status: OrderStatus.ACTIVE,
      products: [
        {
          productId: productId1,
          quantity: 1
        },
        {
          productId: productId2,
          quantity: 2
        }
      ]
    })
    expect(result.userId).toBe(userId)
    expect(result.status).toBe(OrderStatus.ACTIVE)
    expect(result.products).toHaveSize(2)
    orderIdWithProducts = result.id as number
  })
  it('should update an order status', async (): Promise<void> => {
    const result: TestOrder = await testOrderRepository.update({
      id: orderId,
      userId,
      status: OrderStatus.COMPLETE
    })
    expect(result.userId).toBe(userId)
    expect(result.status).toBe(OrderStatus.COMPLETE)
    expect(result.products).toHaveSize(0)
  })
  it('should list all user orders', async (): Promise<void> => {
    const result: TestOrderWithProducts[] = await testOrderRepository.showUserOrders(userId)
    expect(result).toHaveSize(2)
  })
  it('should list all user active orders', async (): Promise<void> => {
    const result: TestOrder[] = await testOrderRepository.filterUserOrders(
      userId,
      OrderStatus.ACTIVE
    )
    expect(result).toHaveSize(1)
  })
  it('should show user active order', async (): Promise<void> => {
    const result: TestOrderWithProducts = await testOrderRepository.showUserCurrentOrder(userId)
    expect(result.userId).toBe(userId)
    expect(result.status).toBe(OrderStatus.ACTIVE)
    expect(result.id).toBe(orderIdWithProducts)
  })
  afterAll(async (): Promise<void> => {
    await testProductRepository.remove(productId1)
    await testProductRepository.remove(productId2)
    await testUserRepository.delete(userId)
  })
})
