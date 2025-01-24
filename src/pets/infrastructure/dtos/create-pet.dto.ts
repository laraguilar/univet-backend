import { IsNotEmpty, IsString, IsDateString, IsInt, Min } from 'class-validator'

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

  @IsDateString()
  birthDate: Date

  @IsInt()
  ownerId: number
}
