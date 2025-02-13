import { IsNotEmpty, IsString, IsInt, Min, IsDateString } from 'class-validator'

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  date: string

  @IsNotEmpty()
  @IsString()
  status: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  clinicId: number

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  petId: number
}
