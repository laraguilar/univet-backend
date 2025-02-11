import { SearchInput } from '@/shared/application/dtos/search-input'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import {
  ClinicScheduleOutput,
  ClinicScheduleOutputMapper,
} from '../dtos/clinic.output'
import { ClinicScheduleRepository } from '@/clinicschedule/domain/repositories/clinic-schedule.repository'

export namespace ListClinicsScheduleUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<ClinicScheduleOutput>

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicScheduleRepository: ClinicScheduleRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const params = new ClinicScheduleRepository.SearchParams(input)
      const searchResult = await this.clinicScheduleRepository.search(params)
      return this.toOutput(searchResult)
    }

    private toOutput(
      searchResult: ClinicScheduleRepository.SearchResult,
    ): Output {
      const items = searchResult.items.map(item => {
        return ClinicScheduleOutputMapper.toOutput(item)
      })
      return PaginationOutputMapper.toOutput(items, searchResult)
    }
  }
}
