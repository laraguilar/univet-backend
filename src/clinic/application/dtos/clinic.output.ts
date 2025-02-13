import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'

export type ClinicOutput = {
  id: number
  name: string
  cnpj: string
  zipCode: string
  street: string
  number: number
  neighborhood: string
  city: string
  state: string
  phone?: string
}

export class ClinicOutputMapper {
  static toOutput(entity: ClinicEntity): ClinicOutput {
    return entity.toJSON()
  }
}
