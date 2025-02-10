import { Entity } from '@/shared/domain/entities/entity'
import { ClinicValidatorFactory } from '../validators/clinic.validator'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'

export type ClinicProps = {
  name: string
  cnpj: string
  zipCode: string
  street: string
  number: number
  neighborhood: string
  city: string
  state: string
  createdAt?: Date
}

export class ClinicEntity extends Entity<ClinicProps> {
  cnpj: string
  zipCode: string
  street: string
  number: number
  neighborhood: string
  city: string
  state: string
  constructor(
    public readonly props: ClinicProps,
    id?: number,
  ) {
    ClinicEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  // Methods
  update(props: Partial<ClinicProps>): void {
    const updatedProps = { ...this.props, ...props }
    ClinicEntity.validate(updatedProps)

    Object.keys(props).forEach(key => {
      if (props[key] !== undefined && props[key] !== null) {
        this.props[key] = props[key]
      }
    })
  }

  updateName(value: string): void {
    ClinicEntity.validate({ ...this.props, name: value })
    this.name = value
  }

  // Getters
  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  // Private Setters
  private set name(value: string) {
    this.props.name = value
  }

  // Validation
  static validate(props: ClinicProps) {
    console.log('Clinic - validate', props)

    const validator = ClinicValidatorFactory.create()
    const isValid = validator.validate(props)
    console.log(validator.errors)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
