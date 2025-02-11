import { Entity } from '@/shared/domain/entities/entity'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'
import { isValidTime, Time } from '@/shared/utils/time'
import { ClinicScheduleValidatorFactory } from '../validators/clinic-schedule.validator'

export type ClinicScheduleProps = {
  dayOfWeek: number
  openTime: string
  closeTime: string
  clinicId: number
  createdAt?: Date
}

export class ClinicScheduleEntity extends Entity<ClinicScheduleProps> {
  dayOfWeek: number
  openTime: Time
  closeTime: Time
  clinicId: number
  constructor(
    public readonly props: ClinicScheduleProps,
    id?: number,
  ) {
    ClinicScheduleEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  // Methods
  update(props: Partial<ClinicScheduleProps>): void {
    const updatedProps = { ...this.props, ...props }
    ClinicScheduleEntity.validate(updatedProps)

    Object.keys(props).forEach(key => {
      if (props[key] !== undefined && props[key] !== null) {
        this.props[key] = props[key]
      }
    })
  }

  updateOpenTime(value: Time): void {
    if (!isValidTime(value)) throw new Error('Invalid time format. Use HH:mm')
    this.props.openTime = value
  }

  updateCloseTime(value: Time): void {
    if (!isValidTime(value)) throw new Error('Invalid time format. Use HH:mm')
    this.props.closeTime = value
  }

  get createdAt() {
    return this.props.createdAt
  }
  // Validation
  static validate(props: ClinicScheduleProps) {
    console.log('Clinic - validate', props)

    const validator = ClinicScheduleValidatorFactory.create()
    const isValid = validator.validate(props)
    console.log(validator.errors)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
