import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { IsString } from 'class-validator'

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @IsString()
  name: string
}
