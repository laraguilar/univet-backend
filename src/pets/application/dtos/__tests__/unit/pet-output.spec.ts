import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { PetOutputMapper } from '../../pet-output'

describe('PetOutputMapper unit tests', () => {
  it('Should convert a Pet in Output ', () => {
    const entity = new PetEntity(PetDataBuilder({}), 3)
    const spyToJson = jest.spyOn(entity, 'toJSON')
    const sut = PetOutputMapper.toOutput(entity)

    expect(spyToJson).toHaveBeenCalledTimes(1)
    expect(sut).toStrictEqual(entity.toJSON())
  })
})
