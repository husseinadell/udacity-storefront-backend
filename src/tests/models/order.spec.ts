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

describe('Test OrderRepository', (): void => {
  beforeAll(async (): Promise<void> => {
    await testProductRepository.create({
      name: 'test product',
      price: 10,
      category: 'test'
    })
    await testProductRepository.create({
      name: 'test product 2',
      price: 20,
      category: 'test2'
    })
    await testUserRepository.create({
      firstName: 'order',
      lastName: 'user',
      password: 'password',
      email: 'order.user@test.com'
    })
  })
  it('should create an order', async (): Promise<void> => {
    const result: TestOrder = await testOrderRepository.create({
      userId: 1,
      status: OrderStatus.ACTIVE
    })
    expect(result.userId).toBe(1)
    expect(result.status).toBe(OrderStatus.ACTIVE)
    expect(result.products).toHaveSize(0)
  })
  it('should create an order with products', async (): Promise<void> => {
    const result: TestOrder = await testOrderRepository.create({
      userId: 1,
      status: OrderStatus.ACTIVE,
      products: [
        {
          productId: 1,
          quantity: 1
        },
        {
          productId: 2,
          quantity: 2
        }
      ]
    })
    expect(result.userId).toBe(1)
    expect(result.status).toBe(OrderStatus.ACTIVE)
    expect(result.products).toHaveSize(2)
  })
  it('should update an order status', async (): Promise<void> => {
    const result: TestOrder = await testOrderRepository.update({
      id: 1,
      userId: 1,
      status: OrderStatus.COMPLETE
    })
    expect(result.userId).toBe(1)
    expect(result.status).toBe(OrderStatus.COMPLETE)
    expect(result.products).toHaveSize(0)
  })
  it('should list all user orders', async (): Promise<void> => {
    const result: TestOrderWithProducts[] = await testOrderRepository.showUserOrders(1)
    expect(result).toHaveSize(2)
  })
  it('should list all user active orders', async (): Promise<void> => {
    const result: TestOrder[] = await testOrderRepository.filterUserOrders(1, OrderStatus.ACTIVE)
    expect(result).toHaveSize(1)
  })
  it('should show user active order', async (): Promise<void> => {
    const result: TestOrderWithProducts = await testOrderRepository.showUserCurrentOrder(1)
    expect(result.userId).toBe(1)
    expect(result.status).toBe(OrderStatus.ACTIVE)
    expect(result.id).toBe(2)
  })
  afterAll(async (): Promise<void> => {
    await testProductRepository.remove(1)
    await testProductRepository.remove(2)
    await testUserRepository.delete(1)
  })
})
