import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'
import { ConflictError } from '@/shared/domain/errors/conflict-error'

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt']

  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      })
      return UserModelMapper.toEntity(user)
    } catch (error) {
      throw new NotFoundError(`UserModel not found using email ${email}`)
    }
  }

  // async getEnumParams(
  //   code: string,
  //   tablename: string,
  // ): Promise<{ key: number; value: string }[]> {
  //   const result = await this.prismaService.enumParams.findUnique({
  //     where: {
  //       code_tablename: {
  //         code,
  //         tablename,
  //       },
  //     },
  //     select: {
  //       value: true,
  //     },
  //   })

  //   return JSON.parse(result.value)
  // }

  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    })
    if (user) {
      throw new ConflictError('Email address already used')
    }
  }

  async search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false
    const orderByField = sortable ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'

    const count = await this.prismaService.user.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.user.findMany({
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

    return new UserRepository.SearchResult({
      items: models.map(model => UserModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    })
  }

  async insert(entity: UserEntity): Promise<UserEntity> {
    // remove a propriedade 'id' da entidade, pois o controle não está mais sendo realizado pela API, mas sim pelo banco de dados
    const { id, ...entityWithoutId } = entity.toJSON()

    const newUser = await this.prismaService.user.create({
      data: entityWithoutId,
    })

    console.log('newUser: ' + JSON.stringify(newUser))

    return UserModelMapper.toEntity({ ...newUser, id: newUser.id })
  }

  // async insertUserReturnEntity(entity: UserEntity): Promise<UserEntity> {
  //   const { id, ...entityWithoutId } = entity.toJSON()

  //   const newUser = await this.prismaService.user.create({
  //     data: entityWithoutId,
  //   })

  //   return UserModelMapper.toEntity(newUser)
  // }

  async update(entity: UserEntity): Promise<void> {
    await this._getById(entity._id)
    await this.prismaService.user.update({
      data: entity.toJSON(),
      where: {
        id: entity._id,
      },
    })
  }

  async delete(id: number): Promise<void> {
    await this._getById(id)
    await this.prismaService.user.delete({
      where: { id },
    })
  }

  findById(id: number): Promise<UserEntity> {
    return this._getById(id)
  }

  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany()
    return models.map(model => UserModelMapper.toEntity(model))
  }

  protected async _getById(id: number): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: Number(id) },
    })

    if (!user) {
      throw new NotFoundError(`UserModel not found using ID ${id}`)
    }

    return UserModelMapper.toEntity(user)
  }
}
