import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { ClinicScheduleRepository } from '@/clinicschedule/domain/repositories/clinic-schedule.repository'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { isValidTime } from '@/shared/utils/time'

export class ClinicScheduleInMemoryRepository
  extends InMemorySearchableRepository<ClinicScheduleEntity>
  implements ClinicScheduleRepository.Repository
{
  async listByClinicId(clinicId: number): Promise<ClinicScheduleEntity[]> {
    const items = await this.getItems() // Aguarda os itens antes de filtrar
    const entities = items.filter(item => item.props.clinicId === clinicId)

    if (entities.length === 0) {
      throw new NotFoundError(`Schedules not found using clinicId: ${clinicId}`)
    }

    return entities
  }
  sortableFields: string[] = ['dayOfWeek']

  async updateOpenTime(entity: ClinicScheduleEntity): Promise<void> {
    const index = this.items.findIndex(item => item.id === entity.id)
    if (index === -1) {
      throw new NotFoundError('Clinic schedule not found')
    }
    if (!isValidTime(entity.props.openTime)) {
      throw new ConflictError('Invalid open time format')
    }
    this.items[index] = new ClinicScheduleEntity(
      {
        ...this.items[index].props,
        openTime: entity.props.openTime,
      },
      this.items[index].id,
    )
  }

  async updateCloseTime(entity: ClinicScheduleEntity): Promise<void> {
    const index = this.items.findIndex(item => item.id === entity.id)
    if (index === -1) {
      throw new NotFoundError('Clinic schedule not found')
    }
    if (!isValidTime(entity.props.closeTime)) {
      throw new ConflictError('Invalid close time format')
    }
    this.items[index] = new ClinicScheduleEntity(
      {
        ...this.items[index].props,
        closeTime: entity.props.closeTime,
      },
      this.items[index].id,
    )
  }

  // Aplica filtro baseado no nome
  protected async applyFilter(
    items: ClinicScheduleEntity[],
    filter: ClinicScheduleRepository.Filter,
  ): Promise<ClinicScheduleEntity[]> {
    if (!filter) {
      return items
    }
    return items.filter(item =>
      item.props.dayOfWeek.toString().includes(filter.toString()),
    )
  }

  // Aplica ordenação, se necessário
  protected async applySort(
    items: ClinicScheduleEntity[],
    sort: string | null,
    sortDir: 'asc' | 'desc' | null,
  ): Promise<ClinicScheduleEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }
}
