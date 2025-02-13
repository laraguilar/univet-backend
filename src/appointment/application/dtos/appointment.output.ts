import { AppointmentEntity } from '@/appointment/domain/entities/appointment.entity'

export type AppointmentOutput = {
  date: Date
  status: string
  clinicId: number
  petId: number
}

export class AppointmentOutputMapper {
  static toOutput(entity: AppointmentEntity): AppointmentOutput {
    return entity.toJSON()
  }
}
