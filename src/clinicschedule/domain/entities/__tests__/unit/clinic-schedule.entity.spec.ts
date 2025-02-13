import {
  ClinicScheduleEntity,
  ClinicScheduleProps,
} from '../../clinic-schedule.entity'

describe('ClinicScheduleEntity unit tests', () => {
  let props: ClinicScheduleProps
  let sut: ClinicScheduleEntity

  beforeEach(() => {
    ClinicScheduleEntity.validate = jest.fn() // Mocking the static method
    props = {
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '18:00',
      clinicId: 10,
      createdAt: new Date(),
    }
    sut = new ClinicScheduleEntity(props, 1)

    console.log('props', sut.props)
  })

  it('Constructor method', () => {
    expect(ClinicScheduleEntity.validate).toHaveBeenCalled()
    expect(sut.props.dayOfWeek).toEqual(props.dayOfWeek)
    expect(sut.props.openTime).toEqual(props.openTime)
    expect(sut.props.closeTime).toEqual(props.closeTime)
    expect(sut.props.clinicId).toEqual(props.clinicId)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  // dayOfWeek -------------------------------->
  it('Getter of dayOfWeek field', () => {
    expect(sut.props.dayOfWeek).toBeDefined()
    expect(sut.props.dayOfWeek).toEqual(props.dayOfWeek)
    expect(typeof sut.props.dayOfWeek).toBe('number')
  })

  // openTime -------------------------------->
  it('Getter of openTime field', () => {
    expect(sut.props.openTime).toBeDefined()
    expect(sut.props.openTime).toEqual(props.openTime)
    expect(typeof sut.props.openTime).toBe('string')
  })

  it('Setter of openTime field', () => {
    sut.updateOpenTime('09:00')
    expect(ClinicScheduleEntity.validate).toHaveBeenCalled()
    expect(sut.props.openTime).toEqual('09:00')
  })

  // closeTime -------------------------------->
  it('Getter of closeTime field', () => {
    expect(sut.props.closeTime).toBeDefined()
    expect(sut.props.closeTime).toEqual(props.closeTime)
    expect(typeof sut.props.closeTime).toBe('string')
  })

  it('Setter of closeTime field', () => {
    sut.updateCloseTime('17:00')
    expect(ClinicScheduleEntity.validate).toHaveBeenCalled()
    expect(sut.props.closeTime).toEqual('17:00')
  })

  // clinicId -------------------------------->
  it('Getter of clinicId field', () => {
    expect(sut.props.clinicId).toBeDefined()
    expect(sut.props.clinicId).toEqual(props.clinicId)
    expect(typeof sut.props.clinicId).toBe('number')
  })

  // createdAt -------------------------------->
  it('Getter of createdAt field', () => {
    expect(sut.props.createdAt).toBeDefined()
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  // Update -------------------------------->
  it('Should update multiple fields', () => {
    sut.update({ openTime: '07:30', closeTime: '16:30', dayOfWeek: 5 })
    expect(ClinicScheduleEntity.validate).toHaveBeenCalled()
    expect(sut.props.openTime).toEqual('07:30')
    expect(sut.props.closeTime).toEqual('16:30')
    expect(sut.props.dayOfWeek).toEqual(5)
  })
})
