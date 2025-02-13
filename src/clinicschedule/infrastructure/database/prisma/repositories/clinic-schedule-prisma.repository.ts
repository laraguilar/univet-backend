import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { ClinicScheduleRepository } from '@/clinicschedule/domain/repositories/clinic-schedule.repository'
import { ClinicScheduleEntity } from '@/clinicschedule/domain/entities/clinic-schedule.entity'
import { ClinicScheduleModelMapper } from '../models/clinic-schedule-model.mapper'

export class ClinicSchedulePrismaRepository
  implements ClinicScheduleRepository.Repository
{
  sortableFields: string[] = ['dayOfWeek', 'createdAt']

  constructor(private readonly prismaService: PrismaService) {}

  async listByClinicId(clinicId: number): Promise<ClinicScheduleEntity[]> {
    const models = await this.prismaService.clinicSchedule.findMany({
      where: {
        clinicId: Number(clinicId),
      },
    })

    return models.map(model => ClinicScheduleModelMapper.toEntity(model))
  }

  async search(
    props: ClinicScheduleRepository.SearchParams,
  ): Promise<ClinicScheduleRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false
    const orderByField = sortable ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'

    const count = await this.prismaService.clinicSchedule.count({
      ...(props.filter && {
        where: {
          dayOfWeek: {
            equals: parseInt(props.filter),
          },
        },
      }),
    })

    const models = await this.prismaService.clinicSchedule.findMany({
      ...(props.filter && {
        where: {
          dayOfWeek: {
            equals: parseInt(props.filter),
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    })

    return new ClinicScheduleRepository.SearchResult({
      items: models.map(model => ClinicScheduleModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    })
  }

  async insert(entity: ClinicScheduleEntity): Promise<ClinicScheduleEntity> {
    console.log('CREATE ClinicSchedule - prisma entity', entity)

    const { id, clinicId, ...entityWithoutId } = entity.toJSON() // Extract clinicId separately to use in the connect
    console.log('CREATE ClinicSchedule - entity without id', entityWithoutId)

    const newModel = await this.prismaService.clinicSchedule.create({
      data: {
        ...entityWithoutId,
        clinic: {
          connect: { id: clinicId }, // connect the clinic schedule to the clinic using clinicId
        },
      },
    })

    return ClinicScheduleModelMapper.toEntity({ ...newModel, id: newModel.id })
  }

  async update(entity: ClinicScheduleEntity): Promise<void> {
    await this._getById(entity._id)
    await this.prismaService.clinicSchedule.update({
      data: entity.toJSON(),
      where: {
        id: entity._id,
      },
    })
  }

  async delete(id: number): Promise<void> {
    await this._getById(id)
    await this.prismaService.clinicSchedule.delete({
      where: { id },
    })
  }

  findById(id: number): Promise<ClinicScheduleEntity> {
    return this._getById(id)
  }

  async findAll(): Promise<ClinicScheduleEntity[]> {
    const models = await this.prismaService.clinicSchedule.findMany()
    return models.map(model => ClinicScheduleModelMapper.toEntity(model))
  }

  protected async _getById(id: number): Promise<ClinicScheduleEntity> {
    const schedule = await this.prismaService.clinicSchedule.findUnique({
      where: { id: Number(id) },
    })

    if (!schedule) {
      throw new NotFoundError(`ClinicScheduleModel not found using ID ${id}`)
    }

    return ClinicScheduleModelMapper.toEntity(schedule)
  }
}
