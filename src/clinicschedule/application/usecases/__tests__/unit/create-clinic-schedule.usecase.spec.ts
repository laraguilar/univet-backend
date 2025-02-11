import { CreateClinicScheduleUseCase } from '../../create-clinic-schedule.usecase'
import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { ClinicScheduleInMemoryRepository } from '@/clinicschedule/infrastructure/database/in-memory/repositories/clinic-schedule-in-memory.repository'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('CreateClinicScheduleUseCase unit tests', () => {
  let sut: CreateClinicScheduleUseCase.UseCase
  let repository: ClinicScheduleInMemoryRepository

  beforeEach(() => {
    repository = new ClinicScheduleInMemoryRepository()
    sut = new CreateClinicScheduleUseCase.UseCase(repository)
  })

  it('Should create a clinic schedule', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')

    const input = {
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '18:00',
      clinicId: 1,
    }

    const result = await sut.execute(input)

    expect(result.id).toBeDefined()
    expect(result.dayOfWeek).toBe(input.dayOfWeek)
    expect(result.openTime).toBe(input.openTime)
    expect(result.closeTime).toBe(input.closeTime)
    expect(result.clinicId).toBe(input.clinicId)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('Should throw error when dayOfWeek is not provided', async () => {
    await expect(
      sut.execute({
        dayOfWeek: null,
        openTime: '08:00',
        closeTime: '18:00',
        clinicId: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when openTime is not provided', async () => {
    await expect(
      sut.execute({
        dayOfWeek: 1,
        openTime: null,
        closeTime: '18:00',
        clinicId: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when closeTime is not provided', async () => {
    await expect(
      sut.execute({
        dayOfWeek: 1,
        openTime: '08:00',
        closeTime: null,
        clinicId: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('Should throw error when clinicId is not provided', async () => {
    await expect(
      sut.execute({
        dayOfWeek: 1,
        openTime: '08:00',
        closeTime: '18:00',
        clinicId: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})
