import { SearchInput } from '@/shared/application/dtos/search-input'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'
import { PetOutput, PetOutputMapper } from '../dtos/pet-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'

export namespace ListPetsUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutput<PetOutput>

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly petRepository: PetRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new PetRepository.SearchParams(input)
      const searchResult = await this.petRepository.search(params)
      return this.toOutput(searchResult)
    }

    private toOutput(searchResult: PetRepository.SearchResult): Output {
      const items = searchResult.items.map(item => {
        return PetOutputMapper.toOutput(item)
      })
      return PaginationOutputMapper.toOutput(items, searchResult)
    }
  }
}
