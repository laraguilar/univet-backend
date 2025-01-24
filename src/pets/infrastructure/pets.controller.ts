import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common'
import { CreatePetDto } from './dtos/create-pet.dto'
import { UpdatePetDto } from './dtos/update-pet.dto'
import { PetOutput } from '../application/dtos/pet-output'
import {
  PetCollectionPresenter,
  PetPresenter,
} from './presenters/pet.presenter'
import { ListPetsUseCase } from '../application/usecases/list-pets.usecase'
import { CreatePetUseCase } from '../application/usecases/create-pet.usecase'
import { DeletePetUseCase } from '../application/usecases/delete-pet.usecase'
import { GetPetUseCase } from '../application/usecases/get-pet.usecase'
import { GetPetsByOwnerUseCase } from '../application/usecases/get-pets-by-owner'
import { UpdatePetUseCase } from '../application/usecases/update-pet.usecase'
import { ListPetsDto } from './dtos/list-pets.dto'

@Controller('pets')
export class PetsController {
  @Inject(CreatePetUseCase.UseCase)
  private createPetUseCase: CreatePetUseCase.UseCase

  @Inject(ListPetsUseCase.UseCase)
  private listPetsUseCase: ListPetsUseCase.UseCase

  @Inject(DeletePetUseCase.UseCase)
  private deletePetUseCase: DeletePetUseCase.UseCase

  @Inject(GetPetUseCase.UseCase)
  private getPetUseCase: GetPetUseCase.UseCase

  @Inject(GetPetsByOwnerUseCase.UseCase)
  private getPetsByOwnerUseCase: GetPetsByOwnerUseCase.UseCase

  @Inject(UpdatePetUseCase.UseCase)
  private updatePetUseCase: UpdatePetUseCase.UseCase

  static petToResponse(output: PetOutput) {
    return new PetPresenter(output)
  }

  static listUsersToResponse(output: ListPetsUseCase.Output) {
    return new PetCollectionPresenter(output)
  }

  @Post()
  async create(@Body() createPetDto: CreatePetDto) {
    const output = await this.createPetUseCase.execute(createPetDto)
    return PetsController.petToResponse(output)
  }

  @Get()
  async search(@Query() searchParams: ListPetsDto) {
    const output = await this.listPetsUseCase.execute(searchParams)
    return PetsController.listUsersToResponse(output)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const output = await this.getPetUseCase.execute({ id })
    return PetsController.petToResponse(output)
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePetDto: UpdatePetDto) {
    const output = await this.updatePetUseCase.execute({ id, ...updatePetDto })
    return PetsController.petToResponse(output)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.deletePetUseCase.execute({ id })
  }
}
