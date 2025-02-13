import { Entity } from '@/shared/domain/entities/entity'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'
import { AppointmentValidatorFactory } from '../validators/appointment.validator'

export type AppointmentProps = {
  date: Date
  status: string
  clinicId: number
  petId: number
  createdAt?: Date
}

export class AppointmentEntity extends Entity<AppointmentProps> {
  constructor(
    public readonly props: AppointmentProps,
    id?: number,
  ) {
    AppointmentEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  updateDate(value: Date): void {
    AppointmentEntity.validate({ ...this.props, date: value })
    this.date = value
  }

  updateStatus(value: string): void {
    AppointmentEntity.validate({ ...this.props, status: value })
    this.status = value
  }

  // Getters

  get status() {
    return this.props.status
  }

  get date() {
    return this.props.date
  }

  get createdAt() {
    return this.props.createdAt
  }

  get clinicId() {
    return this.props.clinicId
  }

  get petId() {
    return this.props.petId
  }

  // Setters

  private set status(value: string) {
    this.props.status = value
  }

  private set date(value: Date) {
    this.props.date = value
  }

  // Validation
  static validate(props: AppointmentProps) {
    console.log('Appointment - validate', props)

    const validator = AppointmentValidatorFactory.create()
    const isValid = validator.validate(props)
    console.log(validator.errors)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
