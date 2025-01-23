import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../../auth.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service'
import { ConfigService } from '@nestjs/config'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'

describe('AuthService unit tests', () => {
  let sut: AuthService
  let jwtService: JwtService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'fakesecretkey',
          signOptions: { expiresIn: '1d' },
        }),
        EnvConfigModule,
      ],
      providers: [AuthService],
    }).compile()

    sut = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should return a jwt', async () => {
    const result = await sut.generateJwt(39021)

    expect(Object.keys(result)).toEqual(['accessToken'])
    expect(typeof result.accessToken).toEqual('string')
  })

  it('should verify a jwt', async () => {
    const result = await sut.generateJwt(43243)

    const validToken = await sut.verifyJwt(result.accessToken)
    expect(validToken).not.toBeNull()

    await expect(sut.verifyJwt('fake')).rejects.toThrow()
    await expect(
      sut.verifyJwt(
        '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      ),
    ).rejects.toThrow()
  })
})
