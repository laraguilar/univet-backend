import { SearchInput } from '@/shared/application/dtos/search-input'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { ClinicOutput, ClinicOutputMapper } from '../dtos/clinic.output'
import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'

export namespace ListClinicsUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<ClinicOutput>

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private readonly clinicRepository: ClinicRepository.Repository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const params = new ClinicRepository.SearchParams(input)
      const searchResult = await this.clinicRepository.search(params)
      return this.toOutput(searchResult)
    }

    private toOutput(searchResult: ClinicRepository.SearchResult): Output {
      const items = searchResult.items.map(item => {
        return ClinicOutputMapper.toOutput(item)
      })
      return PaginationOutputMapper.toOutput(items, searchResult)
    }
  }
}
