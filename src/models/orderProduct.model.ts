import client from '../database'

export type OrderProduct = {
  orderId?: number
  productId: number
  quantity: number
}

export type OrderProductWithInfo = {
  orderId: number
  productId: number
  quantity: number
  name: string
  price: number
  category: string
}

export class OrderProductRepository {
  async createOrderProduct(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await client.connect()
      const sql = `
        insert into order_products ("orderId", "productId", quantity) 
        values ($1, $2, $3) 
        returning *`
      const result = await conn.query(sql, [
        orderProduct.orderId,
        orderProduct.productId,
        orderProduct.quantity
      ])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't create order product because of ${error}`)
    }
  }

  async showOrderProducts(orderId: number): Promise<OrderProduct[]> {
    try {
      const conn = await client.connect()
      const sql = `
        select "orderId", "productId", quantity 
        from order_products
        where "orderId" = $1`
      const result = await conn.query(sql, [orderId])
      conn.release()
      return result.rows
    } catch (error) {
      throw new Error(`Couldn't get order products because of ${error}`)
    }
  }

  async showOrderProductsInfo(orderId: number): Promise<OrderProductWithInfo[]> {
    try {
      const conn = await client.connect()
      const sql = `
        select op."orderId", op."productId", op.quantity, p.name, p.price, p.category 
        from order_products op
        join products p on op."productId" = p.id 
        where op."orderId" = $1`
      const result = await conn.query(sql, [orderId])
      conn.release()
      return result.rows
    } catch (error) {
      throw new Error(`Couldn't get order products because of ${error}`)
    }
  }
}
