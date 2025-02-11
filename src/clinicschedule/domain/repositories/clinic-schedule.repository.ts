import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contract'
import { ClinicScheduleEntity } from '../entities/clinic-schedule.entity'

export namespace ClinicScheduleRepository {
  export type Filter = string

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<
    ClinicScheduleEntity,
    Filter
  > {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Repository
    extends SearchableRepositoryInterface<
      ClinicScheduleEntity,
      Filter,
      SearchParams,
      SearchResult
    > {}
}
