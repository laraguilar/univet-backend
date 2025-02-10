import { PrismaClient } from '@prisma/client'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'
import { ClinicPrismaRepository } from '../../clinic-prisma.repository'

describe('ClinicPrismaRepository Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: ClinicPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    jest.setTimeout(10000)
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new ClinicPrismaRepository(prismaService as any)
    await prismaService.clinic.deleteMany()
  })

  it('should throw error when clinic not found', async () => {
    await expect(() => sut.findById(32)).rejects.toThrow(
      new NotFoundError(`ClinicModel not found using ID 32`),
    )
  })

  it('should find a clinic by id', async () => {
    const entity = new ClinicEntity(
      ClinicDataBuilder({ name: 'Test Clinic', number: 123 }),
      1,
    )
    const clinic = await prismaService.clinic.create({ data: entity.toJSON() })
    const output = await sut.findById(clinic.id)
    expect(output.toJSON()).toStrictEqual({ ...entity.toJSON(), id: clinic.id })
  })

  it('should insert a new clinic', async () => {
    const entity = new ClinicEntity(
      ClinicDataBuilder({ name: 'New Clinic', number: 123 }),
      1,
    )
    const clinic = await sut.insert(entity)
    const result = await prismaService.clinic.findUnique({
      where: { id: clinic.id },
    })
    expect(result).toStrictEqual({ ...entity.toJSON(), id: clinic.id })
  })

  it('should return all clinics', async () => {
    const entity = new ClinicEntity(
      ClinicDataBuilder({ name: 'Clinic A', number: 123 }),
      1,
    )
    await sut.insert(entity)
    const entities = await sut.findAll()
    expect(entities).toHaveLength(1)
    expect(entities[0].toJSON()).toStrictEqual({
      ...entity.toJSON(),
      id: entities[0].id,
    })
  })

  it('should throw error on update when clinic not found', async () => {
    const entity = new ClinicEntity(
      ClinicDataBuilder({ name: 'Nonexistent Clinic', number: 123 }),
      1,
    )
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`ClinicModel not found using ID ${entity._id}`),
    )
  })

  it('should update a clinic', async () => {
    const entity = new ClinicEntity(
      ClinicDataBuilder({ name: 'Old Name', number: 123 }),
      1,
    )
    const clinic = await prismaService.clinic.create({ data: entity.toJSON() })
    entity.update({ name: 'Updated Name' })
    await sut.update(entity)
    const output = await prismaService.clinic.findUnique({
      where: { id: clinic.id },
    })
    expect(output?.name).toBe('Updated Name')
  })

  it('should throw error on delete when clinic not found', async () => {
    await expect(() => sut.delete(999)).rejects.toThrow(
      new NotFoundError(`ClinicModel not found using ID 999`),
    )
  })

  it('should delete a clinic', async () => {
    const entity = new ClinicEntity(
      ClinicDataBuilder({ name: 'Clinic to Delete', number: 123 }),
      1,
    )
    const clinic = await prismaService.clinic.create({ data: entity.toJSON() })
    await sut.delete(clinic.id)
    const output = await prismaService.clinic.findUnique({
      where: { id: clinic.id },
    })
    expect(output).toBeNull()
  })

  it('should search using filter, sort, and pagination', async () => {
    await prismaService.clinic.createMany({
      data: [
        ClinicDataBuilder({ name: 'Alpha Clinic', number: 123 }),
        ClinicDataBuilder({ name: 'Beta Clinic', number: 213 }),
        ClinicDataBuilder({ name: 'Gamma Clinic', number: 786 }),
      ],
    })
    const result = await sut.search(
      new ClinicRepository.SearchParams({
        filter: 'Clinic',
        sort: 'name',
        sortDir: 'asc',
        page: 1,
        perPage: 2,
      }),
    )
    expect(result.items).toHaveLength(2)
    expect(result.items[0].name).toBe('Alpha Clinic')
  })
})
