import { PrismaClient, Pet as PetModel } from '@prisma/client'
import { PetModelMapper } from '../../pet-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { setupPrismaTests } from '../../../../../../../shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('PetModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any
  let userProps: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.pet.deleteMany()
    await prismaService.user.deleteMany()
    userProps = {
      id: 123,
      name: 'Test name',
      email: 'a@a.com',
      password: 'TestPassword123',
    }
    props = {
      id: 21,
      name: 'Test Pet',
      species: 'Dog',
      breed: 'Golden Retriever',
      birthDate: new Date('2020-01-01'),
      weight: 30,
      ownerId: userProps.id,
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throw error when pet model is invalid', async () => {
    const model: PetModel = Object.assign(props, { name: null })
    expect(() => PetModelMapper.toEntity(model)).toThrowError(ValidationError)
  })

  it('should convert a pet model to a pet entity', async () => {
    await prismaService.user.create({
      data: userProps,
    })
    const model: PetModel = await prismaService.pet.create({
      data: props,
    })
    const sut = PetModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(PetEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  }, 10000) // Define o tempo limite para 10 segundos
})
