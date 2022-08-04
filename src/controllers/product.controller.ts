import { Request, Response } from 'express'
import { Product, ProductRepository } from '../models/product.model'

const productRepository = new ProductRepository()

export const index = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as unknown as string | undefined
    const products = await productRepository.index(category)
    res.json(products)
  } catch (error) {
    res.status(500).send(error)
  }
}
export const show = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as unknown as number
    const product = await productRepository.show(productId)
    res.json(product)
  } catch (error) {
    res.status(500).send(error)
  }
}
export const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    }
    const newProduct = await productRepository.create(product)
    res.status(201).json({ product: newProduct })
  } catch (error) {
    res.status(500).send(error)
  }
}
export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    const product: Product = {
      id,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    }
    const updatedProduct = await productRepository.update(product)
    res.json(updatedProduct)
  } catch (error) {
    res.status(500).send(error)
  }
}
export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    const product = await productRepository.remove(id)
    res.json(product)
  } catch (error) {
    res.status(500).send(error)
  }
}
