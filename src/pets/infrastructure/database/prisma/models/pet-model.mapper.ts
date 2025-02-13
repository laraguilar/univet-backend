import { ValidationError } from '@/shared/domain/errors/validation-error'
import { PetEntity, PetProps } from '@/pets/domain/entities/pet.entity'
import { Pet as PetModel } from '@prisma/client'

export class PetModelMapper {
  static toEntity(model: PetModel): PetEntity {
    const data: PetProps = {
      name: model.name,
      species: model.species,
      breed: model.breed,
      birthDate: model.birthDate,
      weight: model.weight,
      ownerId: model.ownerId,
      createdAt: model.createdAt,
    }

    try {
      return new PetEntity(data, model.id)
    } catch {
      throw new ValidationError('The entity could not be loaded from the model')
    }
  }

  static toModel(entity: PetEntity): PetModel {
    return {
      id: entity.id,
      name: entity.name,
      species: entity.species,
      breed: entity.breed,
      birthDate: entity.birthDate,
      weight: entity.weight,
      ownerId: entity.ownerId,
      createdAt: entity.createdAt,
    }
  }
}
