import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DeleteClinicScheduleUseCase } from '../../delete-clinic-schedule.usecase'
import { ClinicScheduleInMemoryRepository } from '@/clinicschedule/infrastructure/database/in-memory/repositories/clinic-schedule-in-memory.repository'
import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { ClinicScheduleDataBuilder } from '@/clinicschedule/domain/testing/helpers/clinic-schedule-data-builder'

describe('DeleteClinicScheduleUseCase', () => {
  let sut: DeleteClinicScheduleUseCase.UseCase
  let clinicScheduleRepository: ClinicScheduleInMemoryRepository

  beforeEach(() => {
    clinicScheduleRepository = new ClinicScheduleInMemoryRepository()
    sut = new DeleteClinicScheduleUseCase.UseCase(clinicScheduleRepository)
  })

  it('should throw NotFoundError if clinicschedule does not exist', async () => {
    const nonExistentclinicScheduleID = 999

    await expect(
      sut.execute({ id: nonExistentclinicScheduleID }),
    ).rejects.toThrow(new NotFoundError(`Entity not found`))
  })

  it('should delete clinic schedule successfully if it exists', async () => {
    const clinicschedule = new ClinicScheduleEntity(
      ClinicScheduleDataBuilder({}),
      1,
    )
    await clinicScheduleRepository.insert(clinicschedule)

    await expect(sut.execute({ id: clinicschedule.id })).resolves.not.toThrow()
    const deletedclinicschedule = clinicScheduleRepository
      .getItems()
      .find(clinicschedule => clinicschedule.id === 1)
    expect(deletedclinicschedule).toBeUndefined()
  })
})
