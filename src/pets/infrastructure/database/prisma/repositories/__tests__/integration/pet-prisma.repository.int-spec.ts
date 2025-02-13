import { PrismaClient } from '@prisma/client'
import { PetPrismaRepository } from '../../pet-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '../../../../../../../shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetDataBuilder } from '@/pets/domain/testing/helpers/pet-data-builder'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { UserEntity } from '@/users/domain/entities/user.entity'

describe('PetPrismaRepository Integration Tests', () => {
  const prismaService = new PrismaClient()
  let sut: PetPrismaRepository
  let module: TestingModule
  let userProps: any

  beforeAll(async () => {
    jest.setTimeout(10000) // Increases the timeout to 10 seconds
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()

    userProps = {
      name: 'Test name',
      email: 'a@a.com',
      password: 'TestPassword123',
    }
  })

  beforeEach(async () => {
    sut = new PetPrismaRepository(prismaService as any)
    await prismaService.pet.deleteMany()
    await prismaService.user.deleteMany()
  })

  it('should throw error when entity not found', async () => {
    await expect(() => sut.findById(32)).rejects.toThrow(
      new NotFoundError(`PetModel not found using ID 32`),
    )
  })

  it('should find an entity by id', async () => {
    const userModel = await prismaService.user.create({
      data: userProps,
    })

    const entity = new PetEntity(PetDataBuilder({ ownerId: userModel.id }))

    const { id, ownerId, ...entityWithoutId } = entity.toJSON()
    const newPet = await prismaService.pet.create({
      data: {
        ...entityWithoutId,
        owner: {
          connect: { id: ownerId }, // connect the pet to the owner using ownerId
        },
      },
    })

    console.log('newPet', newPet)
    const output = await sut.findById(newPet.id)
    expect(output.toJSON()).toStrictEqual({
      ...entity.toJSON(),
      id: newPet.id,
      ownerId: userModel.id,
    })
  })

  it('should insert a new entity', async () => {
    const userModel = await prismaService.user.create({
      data: userProps,
    })
    const ownerId = userModel.id

    const entity = new PetEntity(PetDataBuilder({ ownerId }))
    const pet = await sut.insert(entity)

    const result = await prismaService.pet.findUnique({
      where: { id: pet.id },
    })
    expect(result).toStrictEqual({
      ...entity.toJSON(),
      id: pet.id,
      ownerId,
    })
  })

  it('should return all pets', async () => {
    const userModel = await prismaService.user.create({
      data: userProps,
    })
    const ownerId = userModel.id

    const entity = new PetEntity(PetDataBuilder({ ownerId }))
    await sut.insert(entity)

    const entities = await sut.findAll()
    expect(entities).toHaveLength(1)
    entities.map(item =>
      expect(item.toJSON()).toStrictEqual({
        ...entity.toJSON(),
        ownerId,
        id: item.id,
      }),
    )
  })

  it('should throw error on update when entity not found', async () => {
    const userModel = await prismaService.user.create({
      data: userProps,
    })
    const ownerId = userModel.id

    const entity = new PetEntity(PetDataBuilder({ ownerId }))
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`PetModel not found using ID ${entity._id}`),
    )
  })

  it('should update an entity', async () => {
    const userModel = await prismaService.user.create({
      data: userProps,
    })
    const ownerId = userModel.id

    const entity = new PetEntity(PetDataBuilder({ ownerId }), 10)
    const newPet = await prismaService.pet.create({
      data: entity.toJSON(),
    })

    // Atualiza o nome da entidade
    const updatedName = 'Updated Pet Name'
    entity.update({ name: updatedName })
    await sut.update(entity)

    // Busca o pet atualizado no banco
    const output = await prismaService.pet.findUnique({
      where: {
        id: entity._id,
      },
    })

    // Verifica se os dados foram atualizados corretamente
    expect(output).toMatchObject({
      id: newPet.id,
      name: updatedName,
      ownerId: newPet.ownerId,
    })
    expect(output?.name).toBe(updatedName)
  })

  it('should throw error on delete when entity not found', async () => {
    const userModel = await prismaService.user.create({
      data: userProps,
    })
    const ownerId = userModel.id
    const entity = new PetEntity(PetDataBuilder({ ownerId }))
    await expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`PetModel not found using ID ${entity._id}`),
    )
  })

  it('should delete an entity', async () => {
    const userModel = await prismaService.user.create({
      data: userProps,
    })
    const ownerId = userModel.id

    const entity = new PetEntity(PetDataBuilder({ ownerId }), 10)
    const newPet = await prismaService.pet.create({
      data: entity.toJSON(),
    })
    await sut.delete(entity.id)

    const output = await prismaService.pet.findUnique({
      where: {
        id: entity._id,
      },
    })

    expect(output).toBeNull()
  })

  it('should search using filter, sort and paginate', async () => {
    const userModel = await prismaService.user.create({
      data: userProps,
    })
    const ownerId = userModel.id
    const createdAt = new Date()
    const entities: PetEntity[] = []
    const arrange = ['Fluffy', 'Bella', 'Max', 'Buddy', 'Daisy']
    arrange.forEach((element, index) => {
      entities.push(
        new PetEntity(
          {
            ...PetDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
            ownerId,
          },
          index,
        ),
      )
    })

    await prismaService.pet.createMany({
      data: entities.map(item => item.toJSON()),
    })

    const searchOutputPage1 = await sut.search(
      new PetRepository.SearchParams({
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'Fluffy',
      }),
    )

    expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
      entities[0].toJSON(),
    )
  })
})
