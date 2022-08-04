import { ProductRepository } from '../../models/product.model'

const testProductRepository = new ProductRepository()

type TestProduct = {
  id?: number
  name: string
  price: number
  category: string
  createdAt?: Date
}
let productId: number

describe('Test ProductRepository', (): void => {
  it('should create a prduct', async (): Promise<void> => {
    const result: TestProduct = await testProductRepository.create({
      name: 'test product',
      price: 10,
      category: 'test'
    })
    expect(result.name).toBe('test product')
    expect(result.price).toBe(10)
    expect(result.category).toBe('test')
    productId = result.id as number
  })
  it('should list all products', async (): Promise<void> => {
    const result: TestProduct[] = await testProductRepository.index(undefined)
    expect(result.length).toBeGreaterThan(0)
    expect(result.at(-1)?.name).toBe('test product')
    expect(result.at(-1)?.price).toBe(10)
    expect(result.at(-1)?.category).toBe('test')
  })
  it('should list all products by category', async (): Promise<void> => {
    const category = 'test'
    const result: TestProduct[] = await testProductRepository.index(category)
    expect(result.length).toBe(1)
    expect(result.at(-1)?.name).toBe('test product')
    expect(result.at(-1)?.price).toBe(10)
    expect(result.at(-1)?.category).toBe('test')
  })
  it('should list all products by category (empty list for not found category)', async (): Promise<void> => {
    const category = 'test1'
    const result: TestProduct[] = await testProductRepository.index(category)
    expect(result.length).toBe(0)
  })
  it('should show a product', async (): Promise<void> => {
    const result: TestProduct = await testProductRepository.show(productId)
    expect(result.name).toBe('test product')
    expect(result.price).toBe(10)
    expect(result.category).toBe('test')
  })
  it('should update a product', async (): Promise<void> => {
    const result: TestProduct = await testProductRepository.update({
      id: productId,
      name: 'test product updated',
      price: 20,
      category: 'test1'
    })
    expect(result.name).toBe('test product updated')
    expect(result.price).toBe(20)
    expect(result.category).toBe('test1')
  })
  it('should delete a product', async (): Promise<void> => {
    const result: TestProduct = await testProductRepository.remove(productId)
    expect(result.name).toBe('test product updated')
    expect(result.price).toBe(20)
    expect(result.category).toBe('test1')
  })
})
