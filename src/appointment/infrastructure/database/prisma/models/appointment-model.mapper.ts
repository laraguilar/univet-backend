import { ValidationError } from '@/shared/domain/errors/validation-error'
import {
  ClinicEntity,
  ClinicProps,
} from '@/clinic/domain/entities/clinic.entity'
import { Appointment as AppointmentModel } from '@prisma/client'
import {
  AppointmentEntity,
  AppointmentProps,
} from '@/appointment/domain/entities/appointment.entity'

export class AppointmentModelMapper {
  static toEntity(model: AppointmentModel): AppointmentEntity {
    const data: AppointmentProps = {
      date: model.date,
      status: model.status,
      clinicId: model.clinicId,
      petId: model.petId,
      createdAt: model.createdAt,
    }

    try {
      return new AppointmentEntity(data, model.id)
    } catch {
      throw new ValidationError('The entity could not be loaded from the model')
    }
  }

  static toModel(entity: AppointmentEntity): AppointmentModel {
    return {
      id: entity.id,
      date: entity.date,
      status: entity.status,
      clinicId: entity.clinicId,
      petId: entity.petId,
      createdAt: entity.createdAt,
    }
  }
}
