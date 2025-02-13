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
import { CreateAppointmentUseCase } from '../application/usecases/create-appointment.usecase'
import { GetAppointmentsByOwnerUseCase } from '../application/usecases/get-by-pet-owner.usecase'
import { UpdateAppointmentStatusUseCase } from '../application/usecases/update-status.usecase'
import { AppointmentOutput } from '../application/dtos/appointment.output'
import { AppointmentPresenter } from './presenters/appointment.presenter'
import { CreateAppointmentDto } from './dtos/create-appointment.dto'
import { DeleteAppointmentUseCase } from '../application/usecases/delete-appointment.usecase'
import { UpdateAppointmentStatusDto } from './dtos/update-appointment.dto'

@Controller('appointment')
export class AppointmentController {
  @Inject(CreateAppointmentUseCase.UseCase)
  private createAppointmentUseCase: CreateAppointmentUseCase.UseCase

  @Inject(UpdateAppointmentStatusUseCase.UseCase)
  private updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase.UseCase

  @Inject(GetAppointmentsByOwnerUseCase.UseCase)
  private getAppointmentsByOwnerUseCase: GetAppointmentsByOwnerUseCase.UseCase

  @Inject(DeleteAppointmentUseCase.UseCase)
  private deleteAppointmentUseCase: DeleteAppointmentUseCase.UseCase
  //   @Inject(UpdatePetUseCase.UseCase)
  //   private updatePetUseCase: UpdatePetUseCase.UseCase

  static appointmentToResponse(output: AppointmentOutput) {
    return new AppointmentPresenter(output)
  }

  //   static listUsersToResponse(output: ListClinicsUseCase.Output) {
  //     return {
  //       ...output, // mantém os dados de paginação
  //       items: output.items.map(item => new AppointmentPresenter(item)), // mantém o formato dos itens
  //     }
  //   }

  appoinmentToResponse(outputs: AppointmentOutput[]) {
    return outputs.map(output => new AppointmentPresenter(output))
  }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    const { date, ...rest } = createAppointmentDto
    const dateAsDate = new Date(date) // Convert the string to a Date object

    const output = await this.createAppointmentUseCase.execute({
      ...rest,
      date: dateAsDate, // Use the Date object here
    })

    return AppointmentController.appointmentToResponse(output)
  }

  //   @Get()
  //   async search(@Query() searchParams: ListClinicsDto) {
  //     const output = await this.listClinicsUseCase.execute(searchParams)
  //     return AppointmentController.listUsersToResponse(output)
  //   }

  @Get('/pet-owner/:id')
  async getAppointmentsByOwner(@Param('id') id: number) {
    const output = await this.getAppointmentsByOwnerUseCase.execute({
      ownerId: id,
    })
    return this.appoinmentToResponse(output)
  }

  //   @Get(':id')
  //   async findOne(@Param('id') id: number) {
  //     const output = await this.getClinicUseCase.execute({ id })
  //     return AppointmentController.clinicToResponse(output)
  //   }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateAppointmentStatusDto,
  ) {
    const output = await this.updateAppointmentStatusUseCase.execute({
      id,
      ...updateDto,
    })
    return AppointmentController.appointmentToResponse(output)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.deleteAppointmentUseCase.execute({ id })
  }
}
