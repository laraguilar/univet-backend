import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contract'
import { PetEntity } from '../entities/pet.entity'

export namespace PetRepository {
  export type Filter = string

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<PetEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      PetEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByOwner(ownerId: number): Promise<PetEntity[]> // Certifique-se de que este método está correto
  }
}
