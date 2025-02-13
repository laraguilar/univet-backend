import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { AppointmentProps } from '../entities/appointment.entity'

export class AppointmentRules {
  @IsDate()
  @IsNotEmpty()
  date: Date

  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  status: string

  @IsNumber()
  @IsNotEmpty()
  clinicId: number

  @IsNumber()
  @IsNotEmpty()
  petId: number

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({ date, status, clinicId, petId, createdAt }: AppointmentProps) {
    Object.assign(this, {
      date,
      status,
      clinicId,
      petId,
      createdAt,
    })
  }
}

export class AppointmentValidator extends ClassValidatorFields<AppointmentRules> {
  validate(data: AppointmentProps): boolean {
    return super.validate(
      new AppointmentRules(data ?? ({} as AppointmentProps)),
    )
  }
}

// The factory instanciate the class and call the validate method
export class AppointmentValidatorFactory {
  static create(): AppointmentValidator {
    return new AppointmentValidator()
  }
}
