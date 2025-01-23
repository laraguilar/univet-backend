import { UserRepository } from '@/users/domain/repositories/user.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case'
export namespace GetUserUseCase {
  export type Input = {
    id: number
  }

  export type Output = UserOutput
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<UserOutput> {
      const { id } = input

      if (!id) {
        throw new BadRequestError('Input data not provided')
      }

      const entity = await this.userRepository.findById(id)

      return UserOutputMapper.toOutput(entity)
    }
  }
}
