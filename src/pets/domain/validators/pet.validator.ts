import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import { PetProps } from '@/pets/domain/entities/pet.entity'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator'

// Regras de validação para Pet
export class PetRules {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name?: string

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  species?: string

  @MaxLength(50)
  @IsString()
  @IsOptional()
  breed?: string

  @IsDate()
  @IsNotEmpty()
  birthDate?: Date

  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight?: number

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  ownerId?: number

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({
    name,
    species,
    breed,
    birthDate,
    weight,
    ownerId,
    createdAt,
  }: PetProps) {
    Object.assign(this, {
      name,
      species,
      breed,
      birthDate,
      weight,
      ownerId,
      createdAt,
    })
  }
}

// Validator da entidade Pet
export class PetValidator extends ClassValidatorFields<PetRules> {
  validate(data: PetProps): boolean {
    return super.validate(new PetRules(data ?? ({} as PetProps)))
  }
}

// Fábrica para criar o validator
export class PetValidatorFactory {
  static create(): PetValidator {
    return new PetValidator()
  }
}
