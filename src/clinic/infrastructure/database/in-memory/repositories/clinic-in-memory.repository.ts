import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'

export class ClinicInMemoryRepository
  extends InMemorySearchableRepository<ClinicEntity>
  implements ClinicRepository.Repository
{
  findByName(name: string): Promise<ClinicEntity | undefined> {
    const clinic = this.items.find(
      item => item.props.name.toLowerCase() === name.toLowerCase(),
    )
    if (!clinic) {
      return Promise.reject(
        new NotFoundError(`Clinic not found using name: ${name}`),
      )
    }
    return Promise.resolve(clinic)
  }

  sortableFields: string[] = ['name', 'street', 'createdAt']

  // Aplica filtro baseado no nome
  protected async applyFilter(
    items: ClinicEntity[],
    filter: ClinicRepository.Filter,
  ): Promise<ClinicEntity[]> {
    if (!filter) {
      return items
    }
    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  // Aplica ordenação, se necessário
  protected async applySort(
    items: ClinicEntity[],
    sort: string | null,
    sortDir: 'asc' | 'desc' | null,
  ): Promise<ClinicEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }
}
