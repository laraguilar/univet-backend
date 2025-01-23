import { SignUpUseCase } from '@/users/application/usecases/sign-up.usecase'
import { IsOptional, IsString } from 'class-validator'

export class SignUpDto implements SignUpUseCase.Input {
  @IsString()
  name: string

  @IsString()
  email: string

  @IsString()
  password: string
}
