import client from '../database'
import { OrderProduct, OrderProductRepository, OrderProductWithInfo } from './orderProduct.model'

export enum OrderStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete'
}
export type Order = {
  id?: number
  userId: number
  status: OrderStatus
  createdAt?: Date
  products?: OrderProduct[]
}

export type OrderWithProducts = {
  id?: number
  userId: number
  status: OrderStatus
  createdAt: Date
  products: OrderProductWithInfo[]
}

const orderProductRepository = new OrderProductRepository()

export class OrderRepository {
  async create(order: Order): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql = `
        insert into orders ("userId", status) 
        values ($1, $2) 
        returning *`
      const result = await conn.query(sql, [order.userId, order.status])
      conn.release()
      const createdOrder = result.rows[0]
      const products: OrderProduct[] = []
      if (order.products) {
        for (const product of order.products) {
          const orderProduct = await orderProductRepository.createOrderProduct({
            ...product,
            orderId: createdOrder.id
          })
          products.push(orderProduct)
        }
      }
      return { ...createdOrder, products }
    } catch (error) {
      throw new Error(`Couldn't create order because of ${error}`)
    }
  }

  async update(order: Order): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql = `
        update orders set status = $1 where id = $2 returning *`
      const result = await conn.query(sql, [order.status, order.id])
      conn.release()
      const updatedOrder = result.rows[0]
      if (order.products) {
        for (const product of order.products) {
          await orderProductRepository.createOrderProduct({
            ...product,
            orderId: updatedOrder.id
          })
        }
      }
      const products = await orderProductRepository.showOrderProducts(updatedOrder.id)
      return { ...updatedOrder, products }
    } catch (error) {
      throw new Error(`Couldn't update order because of ${error}`)
    }
  }

  async showUserOrders(userId: number): Promise<OrderWithProducts[]> {
    try {
      const conn = await client.connect()
      const sql = 'select * from orders where "userId" = $1'
      const result = await conn.query(sql, [userId])
      conn.release()
      const orders: OrderWithProducts[] = []
      for (const order of result.rows) {
        const products = await orderProductRepository.showOrderProducts(order.id)
        orders.push({ ...order, products })
      }
      return orders
    } catch (error) {
      throw new Error(`Couldn't get products because of ${error}`)
    }
  }

  async filterUserOrders(userId: number, status: OrderStatus): Promise<OrderWithProducts[]> {
    try {
      const conn = await client.connect()
      const sql = 'select * from orders where "userId" = $1 and status = $2'
      const result = await conn.query(sql, [userId, status])

      conn.release()
      const orders: OrderWithProducts[] = []
      for (const order of result.rows) {
        const products = await orderProductRepository.showOrderProducts(order.id)
        orders.push({ ...order, products })
      }
      return orders
    } catch (error) {
      throw new Error(`Couldn't get products because of ${error}`)
    }
  }

  async showUserCurrentOrder(userId: number): Promise<OrderWithProducts> {
    try {
      const conn = await client.connect()
      const sql =
        'select * from orders where "userId" = $1 and status = $2 order by id desc limit 1'
      const result = await conn.query(sql, [userId, OrderStatus.ACTIVE])
      conn.release()
      const products = await orderProductRepository.showOrderProducts(result.rows[0].id)
      return { ...result.rows[0], products }
    } catch (error) {
      throw new Error(`Couldn't get products because of ${error}`)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const conn = await client.connect()
      const sql = 'delete from orders where id = $1'
      await conn.query(sql, [id])
      conn.release()
    } catch (error) {
      throw new Error(`Couldn't delete order because of ${error}`)
    }
  }
}
