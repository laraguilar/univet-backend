import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ClinicProps } from '../entities/clinic.entity'

// Regras de validacao para Clinica
export class ClinicRules {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name?: string

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  cnpj?: string

  @MaxLength(20)
  @IsString()
  @IsOptional()
  zipCode?: string

  @MaxLength(70)
  @IsString()
  @IsOptional()
  street?: string

  @IsNumber()
  @IsOptional()
  number?: number

  @MaxLength(50)
  @IsString()
  @IsOptional()
  neighborhood?: string

  @MaxLength(20)
  @IsString()
  @IsOptional()
  city?: string

  @MaxLength(20)
  @IsString()
  @IsOptional()
  state?: string

  @MaxLength(30)
  @IsString()
  @IsOptional()
  phone?: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({
    name,
    cnpj,
    zipCode,
    street,
    number,
    neighborhood,
    city,
    state,
    phone,
    createdAt,
  }: ClinicProps) {
    Object.assign(this, {
      name,
      cnpj,
      zipCode,
      street,
      number,
      neighborhood,
      city,
      state,
      phone,
      createdAt,
    })
  }
}

// Validator da entidade Pet
export class ClinicValidator extends ClassValidatorFields<ClinicRules> {
  validate(data: ClinicProps): boolean {
    return super.validate(new ClinicRules(data ?? ({} as ClinicProps)))
  }
}

// Fábrica para criar o validator
export class ClinicValidatorFactory {
  static create(): ClinicValidator {
    return new ClinicValidator()
  }
}
