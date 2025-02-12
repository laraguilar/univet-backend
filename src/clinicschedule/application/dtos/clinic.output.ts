import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { Time } from '@/shared/utils/time'

export type ClinicScheduleOutput = {
  id: number
  dayOfWeek: number
  openTime: string
  closeTime: string
  clinicId: number
}

export class ClinicScheduleOutputMapper {
  static toOutput(entity: ClinicScheduleEntity): ClinicScheduleOutput {
    return entity.toJSON()
  }
}
