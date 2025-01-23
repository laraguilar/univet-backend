import { Entity } from '../entities/entity'

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<E>
  update(entity: E): Promise<void>
  delete(id: number): Promise<void>
  findById(id: number): Promise<E | null>
  findAll(): Promise<E[]>
}
