// import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
// import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
// import { Test, TestingModule } from '@nestjs/testing'
// import { PrismaClient } from '@prisma/client'
// import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests'
// import { UserEntity } from '@/users/domain/entities/user.entity'
// import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
// import { NotFoundError } from '@/shared/domain/errors/not-found-error'
// import { UpdateUserUseCase } from '../../update-user.usecase'

// describe('UpdateUserUseCase integration tests', () => {
//   const prismaService = new PrismaClient()
//   let sut: UpdateUserUseCase.UseCase
//   let repository: UserPrismaRepository
//   let module: TestingModule

//   beforeAll(async () => {
//     setupPrismaTests()
//     module = await Test.createTestingModule({
//       imports: [DatabaseModule.forTest(prismaService)],
//     }).compile()
//     repository = new UserPrismaRepository(prismaService as any)
//   })

//   beforeEach(async () => {
//     sut = new UpdateUserUseCase.UseCase(repository)
//     await prismaService.user.deleteMany()
//   })

//   afterAll(async () => {
//     await module.close()
//   })

//   it('should throws error when entity not found', async () => {
//     expect(sut.execute({ id: 'invalid-id', name: 'any_name' })).rejects.toThrow(
//       new NotFoundError(`UserModel not found using ID invalid-id`),
//     )
//   })

//   it('should udate a user', async () => {
//     const entity = new UserEntity(UserDataBuilder({}))
//     const model = await prismaService.user.create({
//       data: {
//         id: entity.id,
//         name: entity.name,
//         email: entity.email,
//         password: entity.password,
//       },
//     })

//     await sut.execute({ id: entity.id, name: 'new_name' })
//     const output = await prismaService.user.findUnique({
//       where: { id: model.id },
//     })

//     expect(output.name).toBe('new_name')
//   })
// })
