import { PartialType } from '@nestjs/swagger'
import { CreatePetDto } from './create-pet.dto'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePetDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  breed: string

  @IsNumber()
  @IsOptional()
  weight: number
}
