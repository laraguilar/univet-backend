import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { GetClinicScheduleUseCase } from '../../get-clinic-schedule.usecase'
import { ClinicScheduleInMemoryRepository } from '@/clinicschedule/infrastructure/database/in-memory/repositories/clinic-schedule-in-memory.repository'
import { ClinicScheduleDataBuilder } from '@/clinicschedule/domain/testing/helpers/clinic-schedule-data-builder'
import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'

describe('GetClinicScheduleUseCase unit tests', () => {
  let sut: GetClinicScheduleUseCase.UseCase
  let repository: ClinicScheduleInMemoryRepository

  beforeEach(() => {
    repository = new ClinicScheduleInMemoryRepository()
    sut = new GetClinicScheduleUseCase.UseCase(repository)
  })

  it('should return null when clinicSchedule is not found', async () => {
    expect(sut.execute({ id: 4324 })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('should return the clinicSchedule when found', async () => {
    const clinicScheduleData = ClinicScheduleDataBuilder({})
    const clinicSchedule = new ClinicScheduleEntity(clinicScheduleData, 324)
    repository.setItems([clinicSchedule])

    const output = await sut.execute({ id: 324 })
    expect(output).toEqual(clinicSchedule.toJSON())
  })

  it('should return null when no clinicSchedule is found with the given id', async () => {
    const clinicScheduleData = ClinicScheduleDataBuilder({})
    const clinicSchedule = new ClinicScheduleEntity(clinicScheduleData, 324)
    repository.setItems([clinicSchedule])

    expect(sut.execute({ id: 4324 })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })
})
