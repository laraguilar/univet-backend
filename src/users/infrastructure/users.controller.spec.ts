import { UserOutput } from '../application/dtos/user-output'
import { GetUserUseCase } from '../application/usecases/get-user.usecase'
import { ListUsersUseCase } from '../application/usecases/list-users.usecase'
import { SignUpUseCase } from '../application/usecases/sign-up.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase'
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase'
import { SignInDto } from './dtos/sign-in.dto'
import { SignUpDto } from './dtos/sign-up.dto'
import { UpdatePasswordDto } from './dtos/update-password.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/user.presenter'
import { UsersController } from './users.controller'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: number
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = 32
    props = {
      id,
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a user', async () => {
    const output: SignUpUseCase.Output = props
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['signupUseCase'] = mockSignupUseCase as any
    const input: SignUpDto = {
      name: 'Jhon Doe',
      email: 'a@a.com',
      password: '1234',
    }
    const presenter = await sut.create(input)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should authenticate a user', async () => {
    const output = 'fake_token'
    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    const mockAuthService = {
      generateJwt: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['signinUseCase'] = mockSigninUseCase as any
    sut['authService'] = mockAuthService as any

    const input: SignInDto = {
      email: 'a@a.com',
      password: '1234',
    }
    const result = await sut.login(input)
    expect(result).toEqual(output)
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update a user', async () => {
    const output: UpdateUserUseCase.Output = props
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['updateUserUseCase'] = mockUpdateUserUseCase as any
    const input: UpdateUserDto = { name: 'New Name' }

    const presenter = await sut.update(id, input)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('should update password', async () => {
    const output: UpdatePasswordUseCase.Output = props
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any
    const input: UpdatePasswordDto = {
      password: 'NewPassword',
      oldPassword: '1234',
    }
    const presenter = await sut.updatePassword(id, input)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })

  it('should delete a user', async () => {
    const output = undefined
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any
    const input = id
    const result = await sut.remove(id)
    expect(output).toStrictEqual(result)
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('should find a user', async () => {
    const output: GetUserUseCase.Output = props
    const mockFindOneUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['getUserUseCase'] = mockFindOneUserUseCase as any
    const presenter = await sut.findOne(id)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockFindOneUserUseCase.execute).toHaveBeenCalledWith({
      id,
    })
  })

  it('should search users', async () => {
    const output: ListUsersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }
    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    sut['listUsersUseCase'] = mockListUsersUseCase as any
    const searchParams = {
      page: 1,
      perPage: 1,
    }
    const presenter = await sut.search(searchParams)
    expect(presenter).toBeInstanceOf(UserCollectionPresenter)
    expect(presenter).toStrictEqual(new UserCollectionPresenter(output))
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
