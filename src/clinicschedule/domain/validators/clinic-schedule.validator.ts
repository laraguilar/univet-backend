import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator'
import { ClinicScheduleProps } from '../entities/clinic-schedule.entity'

// Regras de validacao para Clinica
export class ClinicScheduleRules {
  @IsNumber()
  @IsNotEmpty()
  dayOfWeek: number

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in HH:mm format',
  })
  openTime: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'closeTime must be in HH:mm format',
  })
  closeTime: string

  @IsNumber()
  @IsNotEmpty()
  clinicId: number

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({
    dayOfWeek,
    openTime,
    closeTime,
    clinicId,
    createdAt,
  }: ClinicScheduleProps) {
    Object.assign(this, {
      dayOfWeek,
      openTime,
      closeTime,
      clinicId,
      createdAt,
    })
  }
}

// Validator da entidade Pet
export class ClinicScheduleValidator extends ClassValidatorFields<ClinicScheduleRules> {
  validate(data: ClinicScheduleProps): boolean {
    return super.validate(
      new ClinicScheduleRules(data ?? ({} as ClinicScheduleProps)),
    )
  }
}

// Fábrica para criar o validator
export class ClinicScheduleValidatorFactory {
  static create(): ClinicScheduleValidator {
    return new ClinicScheduleValidator()
  }
}
