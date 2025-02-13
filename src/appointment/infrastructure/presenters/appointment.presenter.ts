import { AppointmentOutput } from '@/appointment/application/dtos/appointment.output'
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class AppointmentPresenter {
  @ApiProperty({ description: 'Appointment ID' })
  id: number

  @ApiProperty({ description: 'Appointment name' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  date: Date

  @ApiProperty({ description: 'Appointment status' })
  status: string

  @ApiProperty({ description: 'Clinic ID' })
  clinicId: number

  @ApiProperty({ description: 'Pet ID' })
  petId: number

  @ApiProperty({ description: 'Appointment creation date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  constructor(output: AppointmentOutput) {
    this.id = output.id
    this.date = output.date
    this.status = output.status
    this.clinicId = output.clinicId
    this.petId = output.petId
  }
}

// export class AppointmentCollectionPresenter extends CollectionPresenter {
//   data: AppointmentPresenter[]

//   constructor(output: ListAppointmentsUseCase.Output) {
//     const { items, ...paginationProps } = output
//     super(paginationProps)
//     this.data = items.map(item => new AppointmentPresenter(item))
//   }
// }
