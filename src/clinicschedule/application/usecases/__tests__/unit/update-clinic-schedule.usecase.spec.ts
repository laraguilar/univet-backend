import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UpdateClinicScheduleUseCase } from '../../update-clinic-schedule.usecase'
import { ClinicScheduleInMemoryRepository } from '@/clinicschedule/infrastructure/database/in-memory/repositories/clinic-schedule-in-memory.repository'
import { Time } from '@/shared/utils/time'
import { ClinicScheduleDataBuilder } from '@/clinicschedule/domain/testing/helpers/clinic-schedule-data-builder'

let repository: ClinicScheduleInMemoryRepository
let useCase: UpdateClinicScheduleUseCase.UseCase

describe('UpdateClinicScheduleUseCase', () => {
  beforeEach(() => {
    repository = new ClinicScheduleInMemoryRepository()
    useCase = new UpdateClinicScheduleUseCase.UseCase(repository)
  })

  test('deve atualizar o openTime corretamente', async () => {
    const entity = new ClinicScheduleEntity(
      {
        openTime: '08:00' as Time,
        closeTime: '18:00' as Time,
        dayOfWeek: 1,
        clinicId: 1,
      },
      1,
    )
    await repository.insert(entity)

    const output = await useCase.execute({ id: 1, openTime: '09:00' })
    expect(output.openTime).toBe('09:00')
    expect(output.closeTime).toBe('18:00')
  })

  test('deve atualizar o closeTime corretamente', async () => {
    const entity = new ClinicScheduleEntity(
      ClinicScheduleDataBuilder({
        openTime: '08:00',
        closeTime: '18:00',
        dayOfWeek: 1,
      }),
      1,
    )
    await repository.insert(entity)

    const output = await useCase.execute({ id: 1, closeTime: '19:00' })
    expect(output.openTime).toBe('08:00')
    expect(output.closeTime).toBe('19:00')
  })

  test('deve atualizar openTime e closeTime corretamente', async () => {
    const entity = new ClinicScheduleEntity(
      ClinicScheduleDataBuilder({
        openTime: '08:00',
        closeTime: '18:00',
        dayOfWeek: 1,
      }),
      1,
    )
    await repository.insert(entity)

    const output = await useCase.execute({
      id: 1,
      openTime: '09:00',
      closeTime: '20:00',
    })
    expect(output.openTime).toBe('09:00')
    expect(output.closeTime).toBe('20:00')
  })

  test('deve lançar erro ao tentar atualizar um ID inexistente', async () => {
    await expect(
      useCase.execute({ id: 999, openTime: '10:00' }),
    ).rejects.toThrow(NotFoundError)
  })

  test('deve lançar erro ao tentar atualizar sem fornecer um ID', async () => {
    await expect(
      useCase.execute({ id: undefined as any, openTime: '10:00' }),
    ).rejects.toThrow('ClinicSchedule ID is required')
  })
})
