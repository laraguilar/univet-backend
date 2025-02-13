import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { PetOutput } from '@/pets/application/dtos/pet-output' // Importe o DTO de saída para Pet
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ListPetsUseCase } from '@/pets/application/usecases/list-pets.usecase'

export class PetPresenter {
  @ApiProperty({ description: 'Pet ID' })
  id: number

  @ApiProperty({ description: 'Pet name' })
  name: string

  @ApiProperty({ description: 'Pet Specie' })
  species: string

  @ApiProperty({ description: 'Pet breed' })
  breed: string

  @ApiProperty({ description: 'pet birth date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  birthDate: Date

  @ApiProperty({ description: 'pet weight' })
  weight: number

  @ApiProperty({ description: 'pet creation date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  @ApiProperty({ description: 'pet owner id' })
  ownerId: number

  constructor(output: PetOutput) {
    this.id = output.id
    this.name = output.name
    this.species = output.species
    this.breed = output.breed
    this.birthDate = output.birthDate
    this.weight = output.weight
    this.ownerId = output.ownerId
  }
}

export class PetCollectionPresenter extends CollectionPresenter {
  data: PetPresenter[]

  constructor(output: ListPetsUseCase.Output) {
    // Supondo que ListPetsUseCase.Output seja o tipo esperado
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map(item => new PetPresenter(item))
  }
}
