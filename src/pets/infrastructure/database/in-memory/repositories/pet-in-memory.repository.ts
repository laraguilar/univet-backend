import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'

export class PetInMemoryRepository
  extends InMemorySearchableRepository<PetEntity>
  implements PetRepository.Repository
{
  sortableFields: string[] = ['name', 'breed', 'createdAt']

  // Método para buscar pet pelo nome
  async findByName(name: string): Promise<PetEntity> {
    const entity = this.getItems().find(item => item.name === name)
    if (!entity) {
      throw new NotFoundError(`Pet not found using name: ${name}`)
    }
    return entity
  }

  // Verifica se já existe um pet com o mesmo nome para o mesmo dono
  async petNameExists(name: string, ownerId: number): Promise<void> {
    const pet = this.getItems().find(
      item => item.name === name && item.ownerId === ownerId,
    )
    if (pet) {
      throw new ConflictError('Pet name already used for this owner')
    }
  }

  // Aplica filtro baseado no nome
  protected async applyFilter(
    items: PetEntity[],
    filter: PetRepository.Filter,
  ): Promise<PetEntity[]> {
    if (!filter) {
      return items
    }
    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  // Aplica ordenação, se necessário
  protected async applySort(
    items: PetEntity[],
    sort: string | null,
    sortDir: 'asc' | 'desc' | null,
  ): Promise<PetEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }

  // Método para encontrar pets pelo dono (ownerId)
  async findByOwner(ownerId: number): Promise<PetEntity[]> {
    const pets = this.getItems().filter(item => item.ownerId === ownerId)
    if (pets.length === 0) {
      throw new NotFoundError(`No pets found for owner with ID: ${ownerId}`)
    }
    return pets
  }
}
