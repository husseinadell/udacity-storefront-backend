import { validateEmail } from '../utils'

describe('Test validating email', (): void => {
  it('should be invalid email', async (): Promise<void> => {
    const isValidEmail = validateEmail('test.com')
    expect(isValidEmail).toBeFalse()
  })
  it('should be valid email', async (): Promise<void> => {
    const isValidEmail = validateEmail('test@test.com')
    expect(isValidEmail).toBeTrue()
  })
})
