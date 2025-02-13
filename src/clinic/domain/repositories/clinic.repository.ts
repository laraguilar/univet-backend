import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contract'
import { ClinicEntity } from '../entities/clinic.entity'

export namespace ClinicRepository {
  export type Filter = string

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<ClinicEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      ClinicEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByName(name: string): Promise<ClinicEntity | undefined>
  }
}
