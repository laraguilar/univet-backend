import { PetEntity } from '@/pets/domain/entities/pet.entity'

export type PetOutput = {
  id: number
  name: string
  species: string
  breed: string
  birthDate: Date
  ownerId: number
}

export class PetOutputMapper {
  static toOutput(entity: PetEntity): PetOutput {
    return entity.toJSON()
  }
}
