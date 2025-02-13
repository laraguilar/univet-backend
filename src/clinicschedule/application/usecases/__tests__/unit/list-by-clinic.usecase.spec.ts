import { ClinicScheduleInMemoryRepository } from '@/clinicschedule/infrastructure/database/in-memory/repositories/clinic-schedule-in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { ListSchedulesByClinicUseCase } from '../../list-by-clinic.usecase'
import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { ClinicScheduleDataBuilder } from '@/clinicschedule/domain/testing/helpers/clinic-schedule-data-builder'

describe('ListSchedulesByClinicUseCase', () => {
  let sut: ListSchedulesByClinicUseCase.UseCase
  let repository: ClinicScheduleInMemoryRepository

  beforeEach(() => {
    repository = new ClinicScheduleInMemoryRepository()
    sut = new ListSchedulesByClinicUseCase.UseCase(repository)
  })

  it('should return a list of schedules', async () => {
    const clinicId = 1
    const data = ClinicScheduleDataBuilder({ clinicId })
    const s1 = new ClinicScheduleEntity(data, 1)
    const s2 = new ClinicScheduleEntity(
      ClinicScheduleDataBuilder({ clinicId }),
      2,
    )
    repository.setItems([s1, s2])

    const output = await sut.execute({ clinicId })
    expect(output).toEqual([s1.toJSON(), s2.toJSON()])
  })

  it('should return an empty array if no schedules exist', async () => {
    expect(sut.execute({ clinicId: 1 })).rejects.toThrow(
      new NotFoundError(`Schedules not found using clinicId: 1`),
    )
  })
})
