import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'
import { ClinicOutputMapper } from '../../clinic.output'

describe('ClinicOutputMapper unit tests', () => {
  it('Should convert a Clinic in Output ', () => {
    const entity = new ClinicEntity(ClinicDataBuilder({}), 3)
    const spyToJson = jest.spyOn(entity, 'toJSON')
    const sut = ClinicOutputMapper.toOutput(entity)

    expect(spyToJson).toHaveBeenCalledTimes(1)
    expect(sut).toStrictEqual(entity.toJSON())
  })
})
