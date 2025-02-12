import { PrismaClient } from '@prisma/client'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { ClinicSchedulePrismaRepository } from '../../clinic-schedule-prisma.repository'
import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'
import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { ClinicPrismaRepository } from '@/clinic/infrastructure/database/prisma/repositories/clinic-prisma.repository'

describe('ClinicSchedulePrismaRepository Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: ClinicSchedulePrismaRepository
  let clinicRepository: ClinicPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    jest.setTimeout(10000)
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new ClinicSchedulePrismaRepository(prismaService as any)
    clinicRepository = new ClinicPrismaRepository(prismaService as any)
    await prismaService.clinicSchedule.deleteMany()
  })

  it('should throw error when entity not found', async () => {
    await expect(() => sut.findById(9999)).rejects.toThrow(
      new NotFoundError(`ClinicScheduleModel not found using ID 9999`),
    )
  })

  it('should insert a new clinic schedule', async () => {
    const clinicEntity = new ClinicEntity(
      ClinicDataBuilder({ name: 'New Clinic', number: 123 }),
    )
    const clinic = await clinicRepository.insert(clinicEntity)

    const entity = new ClinicScheduleEntity({
      clinicId: clinic._id,
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '12:00',
    })

    const createdSchedule = await sut.insert(entity)
    const result = await prismaService.clinicSchedule.findUnique({
      where: { id: createdSchedule.id },
    })

    expect(result).toMatchObject({
      id: createdSchedule.id,
      clinicId: clinic._id,
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '12:00',
    })
  })

  it('should find an entity by id', async () => {
    const clinicEntity = new ClinicEntity(
      ClinicDataBuilder({ name: 'New Clinic', number: 123 }),
    )
    const clinic = await clinicRepository.insert(clinicEntity)

    const entity = new ClinicScheduleEntity({
      clinicId: clinic._id,
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '12:00',
    })

    const createdSchedule = await sut.insert(entity)
    const foundSchedule = await sut.findById(createdSchedule._id)

    expect(foundSchedule.toJSON()).toStrictEqual({
      id: createdSchedule._id,
      clinicId: clinic._id,
      dayOfWeek: createdSchedule.props.dayOfWeek,
      openTime: createdSchedule.props.openTime,
      closeTime: createdSchedule.props.closeTime,
      createdAt: createdSchedule.props.createdAt,
    })
  })

  it('should update an entity', async () => {
    const clinicEntity = new ClinicEntity(
      ClinicDataBuilder({ name: 'New Clinic', number: 123 }),
    )
    const clinic = await clinicRepository.insert(clinicEntity)

    const entity = new ClinicScheduleEntity({
      clinicId: clinic._id,
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '12:00',
    })

    const createdSchedule = await sut.insert(entity)
    createdSchedule.update({ openTime: '11:00', closeTime: '15:00' })

    console.log('entity updated', createdSchedule)
    await sut.update(createdSchedule)

    const updatedSchedule = await sut.findById(createdSchedule._id)

    console.log('updatedSchedule', updatedSchedule)

    expect(updatedSchedule.toJSON()).toMatchObject({
      id: createdSchedule._id,
      dayOfWeek: createdSchedule.props.dayOfWeek,
      openTime: '11:00',
      closeTime: '15:00',
      clinicId: clinic._id,
      createdAt: createdSchedule.props.createdAt,
    })
  })

  it('should delete an entity', async () => {
    const clinicEntity = new ClinicEntity(
      ClinicDataBuilder({ name: 'New Clinic', number: 123 }),
      1,
    )
    const clinic = await clinicRepository.insert(clinicEntity)

    const entity = new ClinicScheduleEntity({
      clinicId: clinic._id,
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '12:00',
    })
    const createdSchedule = await sut.insert(entity)
    await sut.delete(createdSchedule.id)

    const result = await prismaService.clinicSchedule.findUnique({
      where: { id: createdSchedule.id },
    })

    expect(result).toBeNull()
  })

  it('should return all clinic schedules', async () => {
    const clinicEntity = new ClinicEntity(
      ClinicDataBuilder({ name: 'New Clinic', number: 123 }),
      1,
    )
    const clinic = await clinicRepository.insert(clinicEntity)

    const entity1 = new ClinicScheduleEntity({
      clinicId: clinic._id,
      dayOfWeek: 5,
      openTime: '14:00',
      closeTime: '18:00',
    })
    const entity2 = new ClinicScheduleEntity({
      clinicId: clinic._id,
      dayOfWeek: 6,
      openTime: '15:00',
      closeTime: '19:00',
    })
    await sut.insert(entity1)
    await sut.insert(entity2)

    const schedules = await sut.findAll()
    expect(schedules).toHaveLength(2)
  })
})
