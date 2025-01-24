import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { PetEntity } from '@/pets/domain/entities/pet.entity'
import { PetRepository } from '@/pets/domain/repositories/pet.repository'
import { PetModelMapper } from '../models/pet-model.mapper'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

export class PetPrismaRepository implements PetRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt']

  constructor(private readonly prismaService: PrismaService) {}
  async findByOwner(ownerId: number): Promise<PetEntity[]> {
    const models = await this.prismaService.pet.findMany({
      where: {
        ownerId,
      },
    })
    return models.map(model => PetModelMapper.toEntity(model))
  }

  async search(
    props: PetRepository.SearchParams,
  ): Promise<PetRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false
    const orderByField = sortable ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'

    const count = await this.prismaService.pet.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.pet.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    })

    return new PetRepository.SearchResult({
      items: models.map(model => PetModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    })
  }

  async insert(entity: PetEntity): Promise<PetEntity> {
    const { id, ownerId, ...entityWithoutId } = entity.toJSON() // Extract ownerId separately to use in the connect

    const newPet = await this.prismaService.pet.create({
      data: {
        ...entityWithoutId,
        owner: {
          connect: { id: ownerId }, // connect the pet to the owner using ownerId
        },
      },
    })

    return PetModelMapper.toEntity({ ...newPet, id: newPet.id })
  }

  async update(entity: PetEntity): Promise<void> {
    await this._getById(entity._id)
    await this.prismaService.pet.update({
      data: entity.toJSON(),
      where: {
        id: entity._id,
      },
    })
  }

  async delete(id: number): Promise<void> {
    await this._getById(id)
    await this.prismaService.pet.delete({
      where: { id },
    })
  }

  findById(id: number): Promise<PetEntity> {
    return this._getById(id)
  }

  async findAll(): Promise<PetEntity[]> {
    const models = await this.prismaService.pet.findMany()
    return models.map(model => PetModelMapper.toEntity(model))
  }

  protected async _getById(id: number): Promise<PetEntity> {
    try {
      const pet = await this.prismaService.pet.findUnique({
        where: { id: id },
      })

      return PetModelMapper.toEntity(pet)
    } catch (error) {
      throw new NotFoundError(`PetModel not found using ID ${id}`)
    }
  }
}
