import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase'
import { IsString } from 'class-validator'

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCase.Input, 'id'>
{
  @IsString()
  password: string

  @IsString()
  oldPassword: string
}
