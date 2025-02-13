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
import { CreateClinicUseCase } from '../application/usecases/create-clinic.usecase'
import { ListClinicsUseCase } from '../application/usecases/list-clinics.usecase'
import { DeleteClinicUseCase } from '../application/usecases/delete-clinic.usecase'
import { GetClinicUseCase } from '../application/usecases/get-clinic.usecase'
import { ClinicOutput } from '../application/dtos/clinic.output'
import {
  ClinicCollectionPresenter,
  ClinicPresenter,
} from './presenters/clinic.presenter'
import { CreateClinicDto } from './dtos/create-clinic.dto'
import { ListClinicsDto } from './dtos/list-clinics.dto'

@Controller('clinic')
export class ClinicController {
  @Inject(CreateClinicUseCase.UseCase)
  private createClinicUseCase: CreateClinicUseCase.UseCase

  @Inject(ListClinicsUseCase.UseCase)
  private listClinicsUseCase: ListClinicsUseCase.UseCase

  @Inject(DeleteClinicUseCase.UseCase)
  private deleteClinicUseCase: DeleteClinicUseCase.UseCase

  @Inject(GetClinicUseCase.UseCase)
  private getClinicUseCase: GetClinicUseCase.UseCase

  //   @Inject(UpdatePetUseCase.UseCase)
  //   private updatePetUseCase: UpdatePetUseCase.UseCase

  static clinicToResponse(output: ClinicOutput) {
    return new ClinicPresenter(output)
  }

  static listUsersToResponse(output: ListClinicsUseCase.Output) {
    return {
      ...output, // mantém os dados de paginação
      items: output.items.map(item => new ClinicPresenter(item)), // mantém o formato dos itens
    }
  }

  @Post()
  async create(@Body() createClinicDto: CreateClinicDto) {
    const output = await this.createClinicUseCase.execute(createClinicDto)
    return ClinicController.clinicToResponse(output)
  }

  @Get()
  async search(@Query() searchParams: ListClinicsDto) {
    const output = await this.listClinicsUseCase.execute(searchParams)
    return ClinicController.listUsersToResponse(output)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const output = await this.getClinicUseCase.execute({ id })
    return ClinicController.clinicToResponse(output)
  }

  //   @Patch(':id')
  //   async update(@Param('id') id: number, @Body() updatePetDto: UpdatePetDto) {
  //     const output = await this.updatePetUseCase.execute({ id, ...updatePetDto })
  //     return ClinicController.clinicToResponse(output)
  //   }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.deleteClinicUseCase.execute({ id })
  }
}
