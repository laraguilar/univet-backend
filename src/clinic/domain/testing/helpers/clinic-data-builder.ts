import { faker } from '@faker-js/faker'
import { ClinicProps } from '../../entities/clinic.entity'

type Props = {
  id?: number
  name?: string
  cnpj?: string
  zipCode?: string
  street?: string
  number?: number
  neighborhood?: string
  city?: string
  state?: string
  phone?: string
  createdAt?: Date
}

export function ClinicDataBuilder(props: Props): ClinicProps {
  return {
    name: props.name ?? faker.company.name(),
    cnpj: props.cnpj ?? faker.string.uuid(),
    zipCode: props.zipCode ?? faker.location.zipCode(),
    street: props.street ?? faker.location.street(),
    number: props.number ?? faker.number.int(),
    neighborhood: props.neighborhood ?? faker.location.secondaryAddress(),
    city: props.city ?? faker.location.city(),
    state: props.state ?? faker.location.state(),
    phone: props.phone ?? faker.phone.number(),
    createdAt: props.createdAt ?? new Date(),
  }
}
