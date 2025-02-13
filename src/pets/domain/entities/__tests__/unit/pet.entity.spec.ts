import { PetEntity, PetProps } from '../../pet.entity'
import { PetDataBuilder } from '../../../testing/helpers/pet-data-builder'

describe('PetEntity unit tests', () => {
  let props: PetProps
  let sut: PetEntity

  beforeEach(() => {
    PetEntity.validate = jest.fn() // Mocking the static method
    props = PetDataBuilder({})
    sut = new PetEntity(props, 10)
  })

  it('Constructor method', () => {
    expect(PetEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.species).toEqual(props.species)
    expect(sut.props.breed).toEqual(props.breed)
    expect(sut.props.birthDate).toEqual(props.birthDate)
    expect(sut.props.weight).toEqual(props.weight)
    expect(sut.props.ownerId).toEqual(props.ownerId)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  // Name -------------------------------->
  it('Getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('Setter of name field', () => {
    sut['name'] = 'Updated Pet Name'
    expect(sut.props.name).toEqual('Updated Pet Name')
    expect(typeof sut.props.name).toBe('string')
  })

  // Species -------------------------------->
  it('Getter of species field', () => {
    expect(sut.species).toBeDefined()
    expect(sut.species).toEqual(props.species)
    expect(typeof sut.species).toBe('string')
  })

  // Breed -------------------------------->
  it('Getter of breed field', () => {
    expect(sut.breed).toBeDefined()
    expect(sut.breed).toEqual(props.breed)
    expect(typeof sut.breed).toBe('string')
  })

  it('Setter of breed field', () => {
    sut.updateBreed('Updated Breed')
    expect(sut.props.breed).toEqual('Updated Breed')
    expect(typeof sut.props.breed).toBe('string')
  })

  // BirthDate -------------------------------->
  it('Getter of birthDate field', () => {
    expect(sut.birthDate).toBeDefined()
    expect(sut.birthDate).toEqual(props.birthDate)
    expect(sut.birthDate).toBeInstanceOf(Date)
  })

  // Weight -------------------------------->
  it('Getter of weight field', () => {
    expect(sut.weight).toBeDefined()
    expect(sut.weight).toEqual(props.weight)
    expect(typeof sut.weight).toBe('number')
  })

  it('Setter of weight field', () => {
    sut['weight'] = 20
    expect(sut.props.weight).toEqual(20)
    expect(typeof sut.props.weight).toBe('number')
  })

  // OwnerId -------------------------------->
  it('Getter of ownerId field', () => {
    expect(sut.ownerId).toBeDefined()
    expect(sut.ownerId).toEqual(props.ownerId)
    expect(typeof sut.ownerId).toBe('number')
  })

  // CreatedAt -------------------------------->
  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  // Update -------------------------------->
  it('Should update the name field', () => {
    sut.updateName('Updated Pet Name')
    expect(PetEntity.validate).toHaveBeenCalled()
    expect(sut.name).toEqual('Updated Pet Name')
  })
})
