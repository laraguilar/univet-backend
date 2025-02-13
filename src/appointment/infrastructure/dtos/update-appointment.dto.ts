import { UpdateAppointmentStatusUseCase } from '@/appointment/application/usecases/update-status.usecase'
import { IsString } from 'class-validator'

export class UpdateAppointmentStatusDto
  implements Omit<UpdateAppointmentStatusUseCase.Input, 'id'>
{
  @IsString()
  status: string
}
