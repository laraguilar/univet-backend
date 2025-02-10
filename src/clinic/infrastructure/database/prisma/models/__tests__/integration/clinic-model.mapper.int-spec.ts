import { PrismaClient, Clinic as ClinicModel } from '@prisma/client'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { setupPrismaTests } from '../../../../../../../shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { ClinicModelMapper } from '../../clinic-model.mapper'
import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'

describe('ClinicModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.clinic.deleteMany()
    props = {
      id: 21,
      name: 'Test Clinic',
      cnpj: '12345678901234',
      zipCode: '12345678',
      street: 'Test Street',
      number: 123,
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'TS',
      phone: '123456789',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throw error when clinic model is invalid', async () => {
    const model: ClinicModel = Object.assign(props, { name: null })
    expect(() => ClinicModelMapper.toEntity(model)).toThrowError(
      ValidationError,
    )
  })

  it('should convert a clinic model to a clinic entity', async () => {
    const model: ClinicModel = await prismaService.clinic.create({
      data: props,
    })
    const sut = ClinicModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(ClinicEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  }, 10000) // Define o tempo limite para 10 segundos
})
