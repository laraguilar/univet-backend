import { PartialType } from '@nestjs/swagger'
import { CreatePetDto } from './create-pet.dto'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class UpdatePetDto {
  @IsString()
  @IsNotEmpty()
  key: string

  @IsNotEmpty()
  @IsString()
  @IsNumber()
  value: string | number
}
