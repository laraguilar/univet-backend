import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'

describe('UserEntity integration tests', () => {
  describe('constructor method', () => {
    it('Should throw an error when creating a user with invalid name', () => {
      let props: UserProps = { ...UserDataBuilder({}), name: null }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 123 as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('Should throw an error when creating a user with invalid email', () => {
      let props: UserProps = { ...UserDataBuilder({}), email: null }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), email: '' }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 123 as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('Should throw an error when creating a user with invalid password', () => {
      let props: UserProps = { ...UserDataBuilder({}), password: null }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), password: '' }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 123 as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 'a'.repeat(101) }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('Should throw an error when creating a user with invalid createdAt', () => {
      let props: UserProps = { ...UserDataBuilder({}), createdAt: 123 as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), createdAt: '2024' as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('Should create a valid user', () => {
      expect.assertions(0)
      const props: UserProps = {
        ...UserDataBuilder({}),
      }

      new UserEntity(props)
    })
  })

  describe('Update method', () => {
    it('Should throw an error when update a user with invalid name', () => {
      const entity = new UserEntity({ ...UserDataBuilder({}) })

      expect(() => entity.update(null)).toThrow(EntityValidationError)
      expect(() => entity.update('')).toThrowError(EntityValidationError)
      expect(() => entity.update(10 as any)).toThrowError(EntityValidationError)
      expect(() => entity.update('a'.repeat(256))).toThrowError(
        EntityValidationError,
      )
    })

    it('Should update a valid user', () => {
      expect.assertions(0)
      const props: UserProps = {
        ...UserDataBuilder({}),
      }
      const entity = new UserEntity(props)
      entity.update('new name')
    })
  })

  describe('UpdatePassword method', () => {
    it('Should throw an error when update a user with invalid password', () => {
      const entity = new UserEntity({ ...UserDataBuilder({}) })

      expect(() => entity.updatePassword(null)).toThrow(EntityValidationError)
      expect(() => entity.updatePassword('')).toThrowError(
        EntityValidationError,
      )
      expect(() => entity.updatePassword(10 as any)).toThrowError(
        EntityValidationError,
      )
      expect(() => entity.updatePassword('a'.repeat(101))).toThrowError(
        EntityValidationError,
      )
    })

    it('Should update a valid user', () => {
      expect.assertions(0)
      const props: UserProps = {
        ...UserDataBuilder({}),
      }
      const entity = new UserEntity(props)
      entity.updatePassword('new password')
    })
  })
})
