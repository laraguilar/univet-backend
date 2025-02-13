import {
  ClinicScheduleEntity,
  ClinicScheduleProps,
} from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { ClinicSchedule as ClinicScheduleModel } from '@prisma/client'

export class ClinicScheduleModelMapper {
  static toEntity(model: ClinicScheduleModel): ClinicScheduleEntity {
    const data: ClinicScheduleProps = {
      dayOfWeek: model.dayOfWeek,
      openTime: model.openTime,
      closeTime: model.closeTime,
      clinicId: model.clinicId,
      createdAt: model.createdAt,
    }

    try {
      return new ClinicScheduleEntity(data, model.id)
    } catch {
      throw new ValidationError('The entity could not be loaded from the model')
    }
  }

  static toModel(entity: ClinicScheduleEntity): ClinicScheduleModel {
    return {
      id: entity.id,
      dayOfWeek: entity.dayOfWeek,
      openTime: entity.openTime,
      closeTime: entity.closeTime,
      clinicId: entity.clinicId,
      createdAt: entity.createdAt,
    }
  }
}
