import { faker } from '@faker-js/faker'
import { PetProps } from '../../entities/pet.entity'

type Props = {
  id?: number
  name?: string
  species?: string
  breed?: string
  birthDate?: Date
  weight?: number
  ownerId?: number
  createdAt?: Date
}

export function PetDataBuilder(props: Props): PetProps {
  return {
    name: props.name ?? faker.animal.petName(),
    species: props.species ?? faker.animal.type(),
    breed: props.breed ?? faker.animal.dog(),
    birthDate: props.birthDate ?? faker.date.past({ years: 10 }), // Random date in the last 10 years
    weight:
      props.weight ??
      faker.number.float({ min: 1, max: 50, fractionDigits: 1 }),
    ownerId: props.ownerId ?? faker.number.int({ min: 1, max: 1000 }),
    createdAt: props.createdAt ?? new Date(),
  }
}
