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
import { CreateClinicScheduleUseCase } from '../application/usecases/create-clinic-schedule.usecase'
import { ListClinicsScheduleUseCase } from '../application/usecases/list-clinics-schedule.usecase'
import { DeleteClinicScheduleUseCase } from '../application/usecases/delete-clinic-schedule.usecase'
import { GetClinicScheduleUseCase } from '../application/usecases/get-clinic-schedule.usecase'
import { UpdateClinicScheduleUseCase } from '../application/usecases/update-clinic-schedule.usecase'
import { ClinicScheduleOutput } from '../application/dtos/clinic.output'
import {
  ClinicScheduleCollectionPresenter,
  ClinicSchedulePresenter,
} from './presenters/clinic-schedule.presenter'
import { CreateClinicScheduleDto } from './dtos/create-clinic-schedule.dto'
import { UpdateClinicScheduleDto } from './dtos/update-clinic-schedule.dto'
import { ListClinicScheduleDto } from './dtos/list-clinic-schedule.dto'
import { ListSchedulesByClinicUseCase } from '../application/usecases/list-by-clinic.usecase'

@Controller('clinic-schedule')
export class ClinicScheduleController {
  @Inject(CreateClinicScheduleUseCase.UseCase)
  private createClinicScheduleUseCase: CreateClinicScheduleUseCase.UseCase

  @Inject(ListClinicsScheduleUseCase.UseCase)
  private listClinicsScheduleUseCase: ListClinicsScheduleUseCase.UseCase

  @Inject(ListSchedulesByClinicUseCase.UseCase)
  private listSchedulesByClinicUseCase: ListSchedulesByClinicUseCase.UseCase

  @Inject(DeleteClinicScheduleUseCase.UseCase)
  private deleteClinicScheduleUseCase: DeleteClinicScheduleUseCase.UseCase

  @Inject(GetClinicScheduleUseCase.UseCase)
  private getClinicScheduleUseCase: GetClinicScheduleUseCase.UseCase

  @Inject(UpdateClinicScheduleUseCase.UseCase)
  private updateClinicScheduleUseCase: UpdateClinicScheduleUseCase.UseCase

  static clinicScheduleToResponse(output: ClinicScheduleOutput) {
    return new ClinicSchedulePresenter(output)
  }

  static listClinicScheduleToResponse(
    output: ListClinicsScheduleUseCase.Output,
  ) {
    return new ClinicScheduleCollectionPresenter(output)
  }

  clinicScheduleToResponse(output: ClinicScheduleOutput[]) {
    return output.map(
      clinicSchedule => new ClinicSchedulePresenter(clinicSchedule),
    )
  }

  @Post()
  async create(@Body() createClinicScheduleDto: CreateClinicScheduleDto) {
    const output = await this.createClinicScheduleUseCase.execute(
      createClinicScheduleDto,
    )
    return ClinicScheduleController.clinicScheduleToResponse(output)
  }

  @Get()
  async search(@Query() searchParams: ListClinicScheduleDto) {
    const output = await this.listClinicsScheduleUseCase.execute(searchParams)
    return ClinicScheduleController.listClinicScheduleToResponse(output)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const output = await this.getClinicScheduleUseCase.execute({ id })
    return ClinicScheduleController.clinicScheduleToResponse(output)
  }

  @Get('/clinic/:clinicId')
  async findByClinic(@Param('clinicId') clinicId: number) {
    const outputs = await this.listSchedulesByClinicUseCase.execute({
      clinicId,
    })
    return outputs.map(output =>
      ClinicScheduleController.clinicScheduleToResponse(output),
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateClinicScheduleDto: UpdateClinicScheduleDto,
  ) {
    const output = await this.updateClinicScheduleUseCase.execute({
      id,
      ...updateClinicScheduleDto,
    })
    return ClinicScheduleController.clinicScheduleToResponse(output)
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.deleteClinicScheduleUseCase.execute({ id })
  }
}
