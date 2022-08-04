import { UserRepository } from '../../models/user.model'

const testUserRepository = new UserRepository()

type TestUser = {
  id?: number
  firstName?: string
  lastName?: string
  password?: string
  email?: string
  createdAt?: Date
}
let userId: number

describe('Test UserRepository', (): void => {
  it('should create a user', async (): Promise<void> => {
    const result: TestUser = await testUserRepository.create({
      firstName: 'test',
      lastName: 'user',
      password: 'password',
      email: 'test.user@test.com'
    })
    expect(result.firstName).toBe('test')
    expect(result.lastName).toBe('user')
    expect(result.email).toBe('test.user@test.com')
    userId = result.id as number
  })
  it('should list all users', async (): Promise<void> => {
    const result: TestUser[] = await testUserRepository.index()
    expect(result.length).toBe(1)
    expect(result[0].firstName).toBe('test')
    expect(result[0].lastName).toBe('user')
    expect(result[0].email).toBe('test.user@test.com')
  })
  it('should show a user', async (): Promise<void> => {
    const result: TestUser = await testUserRepository.show(userId)
    expect(result.firstName).toBe('test')
    expect(result.lastName).toBe('user')
    expect(result.email).toBe('test.user@test.com')
  })
  it('should login a user', async (): Promise<void> => {
    const result: TestUser | null = await testUserRepository.login('test.user@test.com', 'password')
    expect(result).not.toBeNull()
    expect(result?.firstName).toBe('test')
    expect(result?.lastName).toBe('user')
    expect(result?.email).toBe('test.user@test.com')
  })
  it('should fail to login a user wrong mail', async (): Promise<void> => {
    const result: TestUser | null = await testUserRepository.login(
      'test.user@test.com1',
      'password'
    )
    expect(result).toBeNull()
  })
  it('should fail to login a user wrong password', async (): Promise<void> => {
    const result: TestUser | null = await testUserRepository.login(
      'test.user@test.com',
      'passwordd'
    )
    expect(result).toBeNull()
  })
  it('should update a user', async (): Promise<void> => {
    const result: TestUser = await testUserRepository.update({
      id: userId,
      firstName: 'test1',
      lastName: 'user1'
    })
    expect(result.firstName).toBe('test1')
    expect(result.lastName).toBe('user1')
  })
})
