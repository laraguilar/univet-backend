import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { ClinicRepository } from '@/clinic/domain/repositories/clinic.repository'
import { ClinicEntity } from '@/clinic/domain/entities/clinic.entity'
import { ClinicModelMapper } from '../models/clinic-model.mapper'

export class ClinicPrismaRepository implements ClinicRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt']

  constructor(private readonly prismaService: PrismaService) {}

  async findByName(name: string): Promise<ClinicEntity | undefined> {
    const clinic = await this.prismaService.clinic.findFirstOrThrow({
      where: { name },
    })

    return clinic ? ClinicModelMapper.toEntity(clinic) : undefined
  }

  async search(
    props: ClinicRepository.SearchParams,
  ): Promise<ClinicRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false
    const orderByField = sortable ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'

    const count = await this.prismaService.clinic.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.clinic.findMany({
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

    return new ClinicRepository.SearchResult({
      items: models.map(model => ClinicModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    })
  }

  async insert(entity: ClinicEntity): Promise<ClinicEntity> {
    console.log('CREATE Pets - prisma entity', entity)

    const { id, ...entityWithoutId } = entity.toJSON() // Extract ownerId separately to use in the connect
    console.log('CREATE Pets - entity without id', entityWithoutId)

    const newClinic = await this.prismaService.clinic.create({
      data: {
        ...entityWithoutId,
      },
    })

    return ClinicModelMapper.toEntity({ ...newClinic, id: newClinic.id })
  }

  async update(entity: ClinicEntity): Promise<void> {
    await this._getById(entity._id)
    await this.prismaService.clinic.update({
      data: entity.toJSON(),
      where: {
        id: entity._id,
      },
    })
  }

  async delete(id: number): Promise<void> {
    await this._getById(id)
    await this.prismaService.clinic.delete({
      where: { id },
    })
  }

  findById(id: number): Promise<ClinicEntity> {
    return this._getById(id)
  }

  async findAll(): Promise<ClinicEntity[]> {
    const models = await this.prismaService.clinic.findMany()
    return models.map(model => ClinicModelMapper.toEntity(model))
  }

  protected async _getById(id: number): Promise<ClinicEntity> {
    const schedule = await this.prismaService.clinic.findUnique({
      where: { id: Number(id) },
    })

    if (!schedule) {
      throw new NotFoundError(`ClinicModel not found using ID ${id}`)
    }

    return ClinicModelMapper.toEntity(schedule)
  }
}
