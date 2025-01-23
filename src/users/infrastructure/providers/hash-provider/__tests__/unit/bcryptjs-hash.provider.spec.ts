import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider'

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })

  it('Should return encrypted password', async () => {
    const password = 'any_password123'
    const encryptedPassword = await sut.generateHash(password)
    expect(encryptedPassword).toBeDefined()
  })
  it('Should return false on invalid password', async () => {
    const password = 'any_password123'
    const encryptedPassword = await sut.generateHash(password)
    const result = await sut.compareHash('invalid_password', encryptedPassword)
    expect(result).toBeFalsy()
  })
  it('Should return true on valid password', async () => {
    const password = 'any_password123'
    const encryptedPassword = await sut.generateHash(password)
    const result = await sut.compareHash(password, encryptedPassword)
    expect(result).toBeTruthy()
  })
})
