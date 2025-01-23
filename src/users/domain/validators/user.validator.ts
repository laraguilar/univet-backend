import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'
import { UserProps } from '@/users/domain/entities/user.entity'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class UserRules {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name?: string

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password?: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({ email, name, password, createdAt }: UserProps) {
    Object.assign(this, {
      email,
      name,
      password,
      createdAt,
    })
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data ?? ({} as UserProps)))
  }
}

// The factory instanciate the class and call the validate method
export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
