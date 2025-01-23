import { SignInUseCase } from '@/users/application/usecases/sign-in.usecase'
import { IsString } from 'class-validator'

export class SignInDto implements SignInUseCase.Input {
  @IsString()
  email: string

  @IsString()
  password: string
}
