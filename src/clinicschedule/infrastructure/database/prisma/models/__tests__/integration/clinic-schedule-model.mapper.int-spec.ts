import {
  PrismaClient,
  ClinicSchedule as ClinicScheduleModel,
} from '@prisma/client'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { ClinicScheduleModelMapper } from '../../clinic-schedule-model.mapper'

describe('ClinicScheduleModelMapper integration tests', () => {
  let prismaService: PrismaClient
  let props: any
  let clinicProps: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async () => {
    await prismaService.clinicSchedule.deleteMany()
    await prismaService.clinic.deleteMany()
    clinicProps = {
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
    props = {
      id: 10,
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '18:00',
      clinicId: clinicProps.id,
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaService.$disconnect()
  })

  it('should throw error when clinic schedule model is invalid', async () => {
    const model: ClinicScheduleModel = Object.assign(props, { openTime: null })
    expect(() => ClinicScheduleModelMapper.toEntity(model)).toThrowError(
      ValidationError,
    )
  })

  it('should convert a clinic schedule model to a clinic schedule entity', async () => {
    await prismaService.clinic.create({
      data: clinicProps,
    })
    const model: ClinicScheduleModel =
      await prismaService.clinicSchedule.create({
        data: props,
      })
    const sut = ClinicScheduleModelMapper.toEntity(model)
    expect(sut).toBeInstanceOf(ClinicScheduleEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  }, 10000) // Define o tempo limite para 10 segundos
})
