import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { ClinicScheduleDataBuilder } from '@/clinicschedule/domain/testing/helpers/clinic-schedule-data-builder'
import { ClinicScheduleOutputMapper } from '../../clinic.output'

describe('ClinicScheduleOutputMapper unit tests', () => {
  it('Should convert a Clinic in Output ', () => {
    const entity = new ClinicScheduleEntity(ClinicScheduleDataBuilder({}), 3)
    const spyToJson = jest.spyOn(entity, 'toJSON')
    const sut = ClinicScheduleOutputMapper.toOutput(entity)

    expect(spyToJson).toHaveBeenCalledTimes(1)
    expect(sut).toStrictEqual(entity.toJSON())
  })
})
