import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsNumber,
} from 'class-validator'

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  species: string

  @IsString()
  @IsNotEmpty()
  breed: string

  @IsNumber()
  @IsOptional()
  weight: number

  @IsDateString()
  birthDate: Date

  @IsInt()
  ownerId: number
}
