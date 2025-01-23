import { Entity } from '../entities/entity'
import { NotFoundError } from '../errors/not-found-error'
import { RepositoryInterface } from './repository-contracts'

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  protected items: E[] = []

  async insert(entity: E): Promise<E> {
    this.items.push(entity)
    return entity
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id)
    const index = this.items.findIndex(item => item.id === entity.id)
    this.items[index] = entity
  }

  async delete(id: number): Promise<void> {
    await this._get(id)
    this.items = this.items.filter(e => e.id !== id)
  }

  async findById(id: number): Promise<E> {
    return this._get(id)
  }

  async findAll(): Promise<E[]> {
    return this.items
  }

  protected async _get(id: number): Promise<E> {
    if (!id) {
      throw new NotFoundError('Entity not found')
    }
    const _id = `${id}`
    const entity = this.items.find(item => item.id.toString() === _id)
    if (!entity) {
      throw new NotFoundError('Entity not found')
    }
    return entity
  }

  public getItems(): E[] {
    return this.items
  }

  public setItems(items: E[]): void {
    this.items = items
  }

  public getItemByIndex(index: number): E | undefined {
    return this.items[index]
  }
}
