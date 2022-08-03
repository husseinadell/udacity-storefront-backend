import { QueryResult } from 'pg'
import client from '../database'

export type Product = {
  id?: number
  name: string
  price: number
  category: string
  createdAt?: Date
}

export type ProductUpdate = {
  id?: number
  name?: string
  price?: string
  category?: string
}

export class ProductRepository {
  async index(category: string | undefined): Promise<Product[]> {
    try {
      const conn = await client.connect()
      let result: QueryResult
      if (category) {
        const sql = 'select * from products where category = $1'
        result = await conn.query(sql, [category])
      } else {
        const sql = 'select * from products'
        result = await conn.query(sql)
      }
      conn.release()
      return result.rows
    } catch (error) {
      throw new Error(`Couldn't get products because of ${error}`)
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect()
      const sql = 'select * from products where id = $1'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't get product because of ${error}`)
    }
  }

  async showByCategory(category: string): Promise<Product> {
    try {
      const conn = await client.connect()
      const sql = 'select * from products where category = $1'
      const result = await conn.query(sql, [category])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't get product because of ${error}`)
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect()
      const sql = `
        insert into products (name, price, category) 
        values ($1, $2, $3) 
        returning *`
      const result = await conn.query(sql, [product.name, product.price, product.category])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't create product because of ${error}`)
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      const conn = await client.connect()
      const sql = `
        update products set name = $1, price = $2, category = $3 
        where id = $4 
        returning *`
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category,
        product.id
      ])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't update product because of ${error}`)
    }
  }

  async remove(id: number): Promise<Product> {
    try {
      const conn = await client.connect()
      const sql = `
        delete from products where id = $1 
        returning *`
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Couldn't delete product because of ${error}`)
    }
  }
}
