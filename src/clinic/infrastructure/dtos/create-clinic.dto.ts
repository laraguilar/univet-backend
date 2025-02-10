import { IsNotEmpty, IsString, IsInt, IsNumber, Min } from 'class-validator'

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  cnpj: string

  @IsString()
  @IsNotEmpty()
  zipCode: string

  @IsString()
  @IsNotEmpty()
  street: string

  @IsNumber()
  @IsInt()
  @Min(1)
  number: number

  @IsString()
  @IsNotEmpty()
  neighborhood: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string
}
