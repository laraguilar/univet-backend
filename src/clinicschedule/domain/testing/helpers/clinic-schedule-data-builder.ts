import { faker } from '@faker-js/faker'
import { ClinicScheduleProps } from '../../entities/clinic-schedule.entity'

type Props = {
  id?: number
  dayOfWeek?: number
  openTime?: string
  closeTime?: string
  clinicId?: number
  createdAt?: Date
}

export function ClinicScheduleDataBuilder(props: Props): ClinicScheduleProps {
  const nowDate = new Date()
  return {
    dayOfWeek: props.dayOfWeek ?? faker.number.int(),
    openTime: props.openTime ?? '08:00',
    closeTime: props.closeTime ?? '23:00',
    clinicId: props.clinicId ?? faker.number.int(),
    createdAt: props.createdAt ?? new Date(),
  }
}
