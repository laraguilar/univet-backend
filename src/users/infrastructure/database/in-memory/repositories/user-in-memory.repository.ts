import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt']

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.getItems().find(item => item.email === email)
    if (!entity) {
      throw new NotFoundError(`Entity not found using email: ${email}`)
    }
    return entity
  }

  async emailExists(email: string): Promise<void> {
    const user = this.getItems().find(item => item.email === email)
    if (user) {
      throw new ConflictError('Email address already used')
    }
  }

  protected async applyFilter(
    items: UserEntity[],
    filter: UserRepository.Filter,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items
    }
    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDir: 'asc' | 'desc' | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }
}
