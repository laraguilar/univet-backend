import { ClinicScheduleOutput } from '@/clinicschedule/application/dtos/clinic.output'
import { ListClinicsScheduleUseCase } from '@/clinicschedule/application/usecases/list-clinics-schedule.usecase'
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class ClinicSchedulePresenter {
  @ApiProperty({ description: 'Clinic schedule ID' })
  id: number

  @ApiProperty({ description: 'Day of the week (0-6, where 0 is Sunday)' })
  dayOfWeek: number

  @ApiProperty({ description: 'Opening time (HH:mm)' })
  openTime: string

  @ApiProperty({ description: 'Closing time (HH:mm)' })
  closeTime: string

  @ApiProperty({ description: 'Clinic ID' })
  clinicId: number

  @ApiProperty({ description: 'Creation date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  constructor(output: ClinicScheduleOutput) {
    this.id = output.id
    this.dayOfWeek = output.dayOfWeek
    this.openTime = output.openTime
    this.closeTime = output.closeTime
    this.clinicId = output.clinicId
  }
}

export class ClinicScheduleCollectionPresenter extends CollectionPresenter {
  data: ClinicSchedulePresenter[]

  constructor(output: ListClinicsScheduleUseCase.Output) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map(item => new ClinicSchedulePresenter(item))
  }
}
