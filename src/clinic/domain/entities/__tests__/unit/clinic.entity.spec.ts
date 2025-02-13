import { ClinicDataBuilder } from '@/clinic/domain/testing/helpers/clinic-data-builder'
import { ClinicEntity, ClinicProps } from '../../clinic.entity'

describe('ClinicEntity unit tests', () => {
  let props: ClinicProps
  let sut: ClinicEntity

  beforeEach(() => {
    ClinicEntity.validate = jest.fn() // Mocking the static method
    props = ClinicDataBuilder({})
    sut = new ClinicEntity(props, 10)
  })

  it('Constructor method', () => {
    expect(ClinicEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.cnpj).toEqual(props.cnpj)
    expect(sut.props.zipCode).toEqual(props.zipCode)
    expect(sut.props.street).toEqual(props.street)
    expect(sut.props.number).toEqual(props.number)
    expect(sut.props.neighborhood).toEqual(props.neighborhood)
    expect(sut.props.city).toEqual(props.city)
    expect(sut.props.state).toEqual(props.state)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  // Name -------------------------------->
  it('Getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('Setter of name field', () => {
    sut['name'] = 'Updated Clinic Name'
    expect(sut.props.name).toEqual('Updated Clinic Name')
    expect(typeof sut.props.name).toBe('string')
  })

  // CNPJ -------------------------------->
  it('Getter of cnpj field', () => {
    expect(sut.props.cnpj).toBeDefined()
    expect(sut.props.cnpj).toEqual(props.cnpj)
    expect(typeof sut.props.cnpj).toBe('string')
  })

  // ZipCode -------------------------------->
  it('Getter of zipCode field', () => {
    expect(sut.props.zipCode).toBeDefined()
    expect(sut.props.zipCode).toEqual(props.zipCode)
    expect(typeof sut.props.zipCode).toBe('string')
  })

  // Address -------------------------------->
  it('Getter of street field', () => {
    expect(sut.props.street).toBeDefined()
    expect(sut.props.street).toEqual(props.street)
    expect(typeof sut.props.street).toBe('string')
  })

  it('Getter of number field', () => {
    expect(sut.props.number).toBeDefined()
    expect(sut.props.number).toEqual(props.number)
    expect(typeof sut.props.number).toBe('number')
  })

  it('Getter of neighborhood field', () => {
    expect(sut.props.neighborhood).toBeDefined()
    expect(sut.props.neighborhood).toEqual(props.neighborhood)
    expect(typeof sut.props.neighborhood).toBe('string')
  })

  it('Getter of city field', () => {
    expect(sut.props.city).toBeDefined()
    expect(sut.props.city).toEqual(props.city)
    expect(typeof sut.props.city).toBe('string')
  })

  it('Getter of state field', () => {
    expect(sut.props.state).toBeDefined()
    expect(sut.props.state).toEqual(props.state)
    expect(typeof sut.props.state).toBe('string')
  })

  // CreatedAt -------------------------------->
  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  // Update -------------------------------->
  it('Should update the name field', () => {
    sut.updateName('Updated Clinic Name')
    expect(ClinicEntity.validate).toHaveBeenCalled()
    expect(sut.name).toEqual('Updated Clinic Name')
  })
})
