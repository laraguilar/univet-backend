import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

let sut: UserValidator

describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create()
  })

  const props = UserDataBuilder({})
  it('Valid case for user validator test', () => {
    const isValid = sut.validate(props)
    expect(isValid).toBeTruthy()
    expect(sut.validatedData).toStrictEqual(new UserRules(props))
  })

  it('Invalidation cases for name field', () => {
    let isValid = sut.validate(null as any)
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 100 characters',
    ])

    // empty name
    isValid = sut.validate({
      ...UserDataBuilder({}),
      name: '' as any,
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual(['name should not be empty'])

    // number as name
    isValid = sut.validate({
      ...UserDataBuilder({}),
      name: 123 as any,
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual([
      'name must be a string',
      'name must be shorter than or equal to 100 characters',
    ])

    // name > 100
    isValid = sut.validate({
      ...UserDataBuilder({}),
      name: 'a'.repeat(256),
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['name']).toStrictEqual([
      'name must be shorter than or equal to 100 characters',
    ])
  })

  it('Invalidation cases for email field', () => {
    let isValid = sut.validate(null as any)
    expect(isValid).toBeFalsy()
    expect(sut.errors['email']).toStrictEqual([
      'email must be an email',
      'email should not be empty',
      'email must be a string',
      'email must be shorter than or equal to 100 characters',
    ])

    // empty email
    isValid = sut.validate({
      ...UserDataBuilder({}),
      email: '' as any,
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['email']).toStrictEqual([
      'email must be an email',
      'email should not be empty',
    ])

    // email as number
    isValid = sut.validate({
      ...UserDataBuilder({}),
      email: 123 as any,
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['email']).toStrictEqual([
      'email must be an email',
      'email must be a string',
      'email must be shorter than or equal to 100 characters',
    ])

    // email > 100
    isValid = sut.validate({
      ...UserDataBuilder({}),
      email: 'a'.repeat(256),
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['email']).toStrictEqual([
      'email must be an email',
      'email must be shorter than or equal to 100 characters',
    ])
  })

  it('Invalidation cases for password field', () => {
    let isValid = sut.validate(null as any)
    expect(isValid).toBeFalsy()
    expect(sut.errors['password']).toStrictEqual([
      'password should not be empty',
      'password must be a string',
      'password must be shorter than or equal to 100 characters',
    ])

    // empty password
    isValid = sut.validate({
      ...UserDataBuilder({}),
      password: '' as any,
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['password']).toStrictEqual([
      'password should not be empty',
    ])

    // number as password
    isValid = sut.validate({
      ...UserDataBuilder({}),
      password: 123 as any,
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['password']).toStrictEqual([
      'password must be a string',
      'password must be shorter than or equal to 100 characters',
    ])

    // password > 100
    isValid = sut.validate({
      ...UserDataBuilder({}),
      password: 'a'.repeat(256),
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['password']).toStrictEqual([
      'password must be shorter than or equal to 100 characters',
    ])
  })

  it('Invalidation cases for createdAt field', () => {
    // password as number
    let isValid = sut.validate({ ...props, createdAt: 1243 as any })
    expect(isValid).toBeFalsy()
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ])

    // password as invalid string date
    isValid = sut.validate({
      ...UserDataBuilder({}),
      createdAt: '2023' as any,
    })
    expect(isValid).toBeFalsy()
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ])
  })
})
