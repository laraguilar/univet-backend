import { Entity } from '@/shared/domain/entities/entity'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'
import { PetValidatorFactory } from '../validators/pet.validator'

export type PetProps = {
  name: string
  species: string
  breed?: string
  birthDate: Date // Data de nascimento do pet
  weight?: number
  ownerId: number // Refere-se ao ID do dono do pet (relacionamento com User)
  createdAt?: Date
}

export class PetEntity extends Entity<PetProps> {
  constructor(
    public readonly props: PetProps,
    id?: number,
  ) {
    PetEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  // Methods

  // Função de atualização generalista
  update<K extends keyof PetProps>(key: K, value: PetProps[K]): void {
    // Valida a atualização
    const updatedProps = { ...this.props, [key]: value }
    PetEntity.validate(updatedProps)

    // Atualiza a propriedade da entidade
    this.props[key] = value
  }

  updateName(value: string): void {
    PetEntity.validate({ ...this.props, name: value })
    this.name = value
  }

  updateWeight(value: number): void {
    PetEntity.validate({ ...this.props, weight: value })
    this.weight = value
  }

  updateBirthDate(value: Date): void {
    PetEntity.validate({ ...this.props, birthDate: value })
    this.birthDate = value
  }

  updateBreed(newBreed: string): void {
    PetEntity.validate({ ...this.props, breed: newBreed })
    this.props.breed = newBreed
  }

  // Getters
  get name() {
    return this.props.name
  }

  get species() {
    return this.props.species
  }

  get breed() {
    return this.props.breed
  }

  get birthDate() {
    return this.props.birthDate
  }

  get age() {
    const now = new Date()
    const birthDate = new Date(this.props.birthDate)
    let age = now.getFullYear() - birthDate.getFullYear()
    const monthDiff = now.getMonth() - birthDate.getMonth()

    // Ajusta a idade se o aniversário ainda não tiver ocorrido este ano
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < birthDate.getDate())
    ) {
      age -= 1
    }
    return age
  }

  get weight() {
    return this.props.weight
  }

  get ownerId() {
    return this.props.ownerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  // Private Setters
  private set name(value: string) {
    this.props.name = value
  }

  private set weight(value: number | undefined) {
    this.props.weight = value
  }

  private set birthDate(value: Date) {
    this.props.birthDate = value
  }

  // Validation
  static validate(props: PetProps) {
    const validator = PetValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
