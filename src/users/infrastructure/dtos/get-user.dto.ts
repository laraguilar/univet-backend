import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'
import { IsString } from 'class-validator'

export class GetUserDto implements Omit<GetUserUseCase.Input, 'id'> {
  @IsString()
  name: string
}
