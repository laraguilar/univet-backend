import { UserRepository } from '@/users/domain/repositories/user.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'

export namespace UpdateUserUseCase {
  export type Input = {
    id: number
    name: string
  }

  export type Output = UserOutput
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<UserOutput> {
      if (!input.name) {
        throw new BadRequestError('Name not provided')
      }

      const entity = await this.userRepository.findById(input.id)
      entity.update(input.name)
      await this.userRepository.update(entity)
      return UserOutputMapper.toOutput(entity)
    }
  }
}
