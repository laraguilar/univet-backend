import { IsString, Matches, IsNotEmpty } from 'class-validator'

export class UpdateClinicScheduleDto {
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
}
