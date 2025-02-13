import {
  IsNotEmpty,
  IsInt,
  Min,
  IsString,
  IsOptional,
  Matches,
  Max,
} from 'class-validator'

export class CreateClinicScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  dayOfWeek: number

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Use HH:mm',
  })
  @IsNotEmpty()
  openTime: string

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Use HH:mm',
  })
  @IsNotEmpty()
  closeTime: string

  @IsInt()
  @IsNotEmpty()
  clinicId: number

  @IsOptional()
  createdAt?: Date
}
