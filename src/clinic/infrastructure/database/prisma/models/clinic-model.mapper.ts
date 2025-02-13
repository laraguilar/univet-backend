import { ValidationError } from '@/shared/domain/errors/validation-error'
import {
  ClinicEntity,
  ClinicProps,
} from '@/clinic/domain/entities/clinic.entity'
import { Clinic as ClinicModel } from '@prisma/client'

export class ClinicModelMapper {
  static toEntity(model: ClinicModel): ClinicEntity {
    const data: ClinicProps = {
      name: model.name,
      cnpj: model.cnpj,
      zipCode: model.zipCode,
      street: model.street,
      number: model.number,
      neighborhood: model.neighborhood,
      city: model.city,
      state: model.state,
      phone: model.phone,
      createdAt: model.createdAt,
    }

    try {
      return new ClinicEntity(data, model.id)
    } catch {
      throw new ValidationError('The entity could not be loaded from the model')
    }
  }

  static toModel(entity: ClinicEntity): ClinicModel {
    return {
      id: entity.id,
      name: entity.name,
      cnpj: entity.cnpj,
      zipCode: entity.zipCode,
      street: entity.street,
      number: entity.number,
      neighborhood: entity.neighborhood,
      city: entity.city,
      state: entity.state,
      phone: entity.phone,
      createdAt: entity.createdAt,
    }
  }
}
