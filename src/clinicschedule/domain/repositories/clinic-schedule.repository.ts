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

  export interface Repository
    extends SearchableRepositoryInterface<
      ClinicScheduleEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    update(entity: ClinicScheduleEntity): Promise<void>
    updateOpenTime(entity: ClinicScheduleEntity): Promise<void>
    updateCloseTime(entity: ClinicScheduleEntity): Promise<void>
  }
}
