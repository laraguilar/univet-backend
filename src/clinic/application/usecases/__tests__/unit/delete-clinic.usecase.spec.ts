import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { DeleteClinicUseCase } from '../../delete-clinic.usecase'
import { ClinicInMemoryRepository } from '@/clinic/infrastructure/database/in-memory/repositories/clinic-in-memory.repository'
import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'

describe('DeleteClinicUseCase', () => {
  let sut: DeleteClinicUseCase.UseCase
  let clinicRepository: ClinicInMemoryRepository

  beforeEach(() => {
    clinicRepository = new ClinicInMemoryRepository()
    sut = new DeleteClinicUseCase.UseCase(clinicRepository)
  })

  it('should throw NotFoundError if clinic does not exist', async () => {
    const nonExistentClinic = 999

    await expect(sut.execute({ id: nonExistentClinic })).rejects.toThrow(
      new NotFoundError(`Entity not found`),
    )
  })

  it('should delete clinic successfully if it exists', async () => {
    const clinic = new ClinicEntity(ClinicDataBuilder({ name: 'Buddy' }), 1)
    await clinicRepository.insert(clinic)

    await expect(sut.execute({ id: clinic.id })).resolves.not.toThrow()
    const deletedClinic = clinicRepository
      .getItems()
      .find(clinic => clinic.id === 1)
    expect(deletedClinic).toBeUndefined()
  })
})
