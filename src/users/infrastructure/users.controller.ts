import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common'
import { SignUpDto } from './dtos/sign-up.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { AuthService } from '@/auth/infrastructure/auth.service'
import {
  UserPresenter,
  UserCollectionPresenter,
} from './presenters/user.presenter'
import { SignUpUseCase } from '../application/usecases/sign-up.usecase'
import { UserOutput } from '../application/dtos/user-output'
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase'
import { GetUserUseCase } from '../application/usecases/get-user.usecase'
import { ListUsersUseCase } from '../application/usecases/list-users.usecase'
import { SignInUseCase } from '../application/usecases/sign-in.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase'
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase'
import { ListUsersDto } from './dtos/list-users.dto'
import { SignInDto } from './dtos/sign-in.dto'
import { UpdatePasswordDto } from './dtos/update-password.dto'

@Controller('users')
export class UsersController {
  @Inject(SignUpUseCase.UseCase)
  private signupUseCase: SignUpUseCase.UseCase

  @Inject(SignInUseCase.UseCase)
  private signinUseCase: SignInUseCase.UseCase

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase

  @Inject(UpdatePasswordUseCase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase.UseCase

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase

  @Inject(AuthService)
  private authService: AuthService

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output)
  }

  static listUsersToResponse(output: ListUsersUseCase.Output) {
    return new UserCollectionPresenter(output)
  }

  @Post()
  async create(@Body() signupUserDto: SignUpDto) {
    console.log('User controller: ' + JSON.stringify(signupUserDto))
    const output = await this.signupUseCase.execute(signupUserDto)
    console.log('User controller output: ' + JSON.stringify(output))
    return UsersController.userToResponse(output)
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    const output = await this.signinUseCase.execute(signInDto)
    return this.authService.generateJwt(output.id)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams)
    return UsersController.listUsersToResponse(output)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const output = await this.getUserUseCase.execute({ id: id })
    return UsersController.userToResponse(output)
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    })
    return UsersController.userToResponse(output)
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    })
    return UsersController.userToResponse(output)
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.deleteUserUseCase.execute({ id })
  }
}
