// import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
// import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
// import { Test, TestingModule } from '@nestjs/testing'
// import { PrismaClient } from '@prisma/client'
// import { HashProvider } from '@/shared/application/providers/hash-provider'
// import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
// import { SignUpUseCase } from '../../sign-up.usecase'
// import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests'

// describe('SignupUseCase integration tests', () => {
//   const prismaService = new PrismaClient()
//   let sut: SignUpUseCase.UseCase
//   let repository: UserPrismaRepository
//   let module: TestingModule
//   let hashProvider: HashProvider

//   beforeAll(async () => {
//     setupPrismaTests()
//     module = await Test.createTestingModule({
//       imports: [DatabaseModule.forTest(prismaService)],
//     }).compile()
//     repository = new UserPrismaRepository(prismaService as any)
//     hashProvider = new BcryptjsHashProvider()
//   })

//   beforeEach(async () => {
//     sut = new SignUpUseCase.UseCase(repository, hashProvider)
//     await prismaService.user.deleteMany()
//   })

//   afterAll(async () => {
//     await module.close()
//   })

//   it('should create a user', async () => {
//     const props = {
//       name: 'test name',
//       email: 'a@a.com',
//       password: 'TestPassword123',
//     }
//     const output = await sut.execute(props)
//     expect(output.id).toBeDefined()
//     expect(output.createdat).toBeInstanceOf(Date)
//   })
// })
