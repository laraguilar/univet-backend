import { ListClinicsScheduleUseCase } from '@/clinicschedule/application/usecases/list-clinics-schedule.usecase'
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract'
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ListClinicScheduleDto implements ListClinicsScheduleUseCase.Input {
  @IsNumber()
  @IsOptional()
  page?: number

  @IsNumber()
  @IsOptional()
  perPage?: number

  @IsString()
  @IsOptional()
  sort?: string

  @IsString()
  @IsOptional()
  sortDir?: SortDirection

  @IsString()
  @IsOptional()
  filter?: string
}
