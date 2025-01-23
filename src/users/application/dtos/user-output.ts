import { UserEntity } from '@/users/domain/entities/user.entity'

export type UserOutput = {
  id: number
  name: string
  email: string
  password: string
}

export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutput {
    return entity.toJSON()
  }
}
