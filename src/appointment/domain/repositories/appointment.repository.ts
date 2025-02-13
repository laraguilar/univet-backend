import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contract'
import { AppointmentEntity } from '../entities/appointment.entity'

export namespace AppointmentRepository {
  export type Filter = string

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<
    AppointmentEntity,
    Filter
  > {}

  export interface Repository
    extends SearchableRepositoryInterface<
      AppointmentEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    updateStatus(id: number, status: string): Promise<void>
    getByPetOwnerId(petOwnerId: number): Promise<AppointmentEntity[]>
    findByPetIds(petIds: number[]): Promise<AppointmentEntity[]>
  }
}
