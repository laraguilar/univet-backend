import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ListClinicsUseCase } from '@/clinic/application/usecases/list-clinics.usecase'
import { ClinicOutput } from '@/clinic/application/dtos/clinic.output'

export class ClinicPresenter {
  @ApiProperty({ description: 'Clinic ID' })
  id: number

  @ApiProperty({ description: 'Clinic name' })
  name: string

  @ApiProperty({ description: 'Clinic CNPJ' })
  cnpj: string

  @ApiProperty({ description: 'Clinic ZipCode' })
  zipCode: string

  @ApiProperty({ description: 'Clinic Street' })
  street: string

  @ApiProperty({ description: 'Clinic Address Number' })
  number: number

  @ApiProperty({ description: 'Clinic Neighborhood' })
  neighborhood: string

  @ApiProperty({ description: 'Clinic City' })
  city: string

  @ApiProperty({ description: 'Clinic State' })
  state: string

  @ApiProperty({ description: 'Clinic creation date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date

  constructor(output: ClinicOutput) {
    this.id = output.id
    this.name = output.name
    this.cnpj = output.cnpj
    this.zipCode = output.zipCode
    this.street = output.street
    this.number = output.number
    this.neighborhood = output.neighborhood
    this.city = output.city
    this.state = output.state
  }
}

export class ClinicCollectionPresenter extends CollectionPresenter {
  data: ClinicPresenter[]

  constructor(output: ListClinicsUseCase.Output) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map(item => new ClinicPresenter(item))
  }
}
