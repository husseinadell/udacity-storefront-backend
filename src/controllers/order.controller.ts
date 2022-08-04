import { Request, Response } from 'express'
import { Order, OrderRepository, OrderStatus, OrderWithProducts } from '../models/order.model'

const orderRepository = new OrderRepository()

export const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      userId: res.locals.user.id,
      status: req.body.status,
      products: req.body.products
    }
    const newOrder = await orderRepository.create(order)
    res.status(201).json(newOrder)
  } catch (error) {
    res.status(500).send(error)
  }
}
export const showUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id
    const status = req.query.status as OrderStatus
    let orders: OrderWithProducts[] = []
    if (status) {
      orders = await orderRepository.filterUserOrders(userId, status)
    } else {
      orders = await orderRepository.showUserOrders(userId)
    }
    res.json(orders)
  } catch (error) {
    res.status(500).send(error)
  }
}
export const showUserCurrentOrder = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user.id
    const order = await orderRepository.showUserCurrentOrder(userId)
    res.json(order)
  } catch (error) {
    res.status(500).send(error)
  }
}
export const update = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      id: req.params.id as unknown as number,
      userId: res.locals.user.id,
      status: req.body.status,
      products: req.body.products
    }
    const updatedOrder = await orderRepository.update(order)
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).send(error)
  }
}
