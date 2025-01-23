import { Entity } from '../../entity'

type StubProps = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('Should set props, and set id as null', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    }
    const entity = new StubEntity(props)

    expect(entity.props).toStrictEqual(props)
    expect(entity._id).toBeNull()
  })

  it('Should accept valid id', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    }
    const id = 123
    const entity = new StubEntity(props, id)

    expect(entity._id).not.toBeNull()
    expect(entity._id).toBe(id)
  })

  it('Should convert entity to JSON', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    }
    const id = 432432
    const entity = new StubEntity(props, id)

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props,
    })
  })

  it('Should get an id', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    }
    const id = 432432
    const entity = new StubEntity(props, id)

    expect(entity.id).not.toBeNull()
  })
})
