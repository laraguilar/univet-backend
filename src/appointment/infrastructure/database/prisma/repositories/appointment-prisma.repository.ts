import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { AppointmentRepository } from '@/appointment/domain/repositories/appointment.repository'
import { AppointmentEntity } from '@/appointment/domain/entities/appointment.entity'
import { AppointmentModelMapper } from '../models/appointment-model.mapper'

export class AppointmentPrismaRepository
  implements AppointmentRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt']

  constructor(private readonly prismaService: PrismaService) {}
  // Atualiza o status do appointment
  async updateStatus(id: number, status: string): Promise<void> {
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id },
    })

    if (!appointment) {
      throw new NotFoundError(`Appointment with ID ${id} not found`)
    }

    await this.prismaService.appointment.update({
      where: { id },
      data: {
        status,
      },
    })
  }

  // Recupera appointments baseados no ID do dono do pet
  async getByPetOwnerId(petOwnerId: number): Promise<AppointmentEntity[]> {
    // Primeiro, buscamos os pets do dono
    const pets = await this.prismaService.pet.findMany({
      where: {
        ownerId: petOwnerId,
      },
    })

    if (!pets || pets.length === 0) {
      throw new NotFoundError(`No pets found for owner with ID ${petOwnerId}`)
    }

    // Recupera os appointments relacionados aos pets
    const appointments = await this.prismaService.appointment.findMany({
      where: {
        petId: {
          in: pets.map(pet => pet.id),
        },
      },
    })

    // Mapeia os appointments para instâncias de AppointmentEntity
    return appointments.map(
      appointment =>
        new AppointmentEntity(
          {
            date: appointment.date,
            status: appointment.status,
            clinicId: appointment.clinicId,
            petId: appointment.petId,
            createdAt: appointment.createdAt,
          },
          appointment.id,
        ),
    )
  }

  // Recupera appointments baseados nos IDs dos pets
  async findByPetIds(petIds: number[]): Promise<AppointmentEntity[]> {
    const appointments = await this.prismaService.appointment.findMany({
      where: {
        petId: {
          in: petIds,
        },
      },
    })

    if (!appointments || appointments.length === 0) {
      throw new NotFoundError(
        `No appointments found for pets with IDs ${petIds.join(', ')}`,
      )
    }

    // Mapeia os appointments para instâncias de AppointmentEntity
    return appointments.map(
      appointment =>
        new AppointmentEntity(
          {
            date: appointment.date,
            status: appointment.status,
            clinicId: appointment.clinicId,
            petId: appointment.petId,
            createdAt: appointment.createdAt,
          },
          appointment.id,
        ),
    )
  }

  async search(
    props: AppointmentRepository.SearchParams,
  ): Promise<AppointmentRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false
    const orderByField = sortable ? props.sort : 'createdAt'
    const orderByDir = sortable ? props.sortDir : 'desc'

    const count = await this.prismaService.appointment.count({
      ...(props.filter && {
        where: {
          status: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.appointment.findMany({
      ...(props.filter && {
        where: {
          status: {
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

    return new AppointmentRepository.SearchResult({
      items: models.map(model => AppointmentModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    })
  }

  async insert(entity: AppointmentEntity): Promise<AppointmentEntity> {
    console.log('CREATE Pets - prisma entity', entity)

    const { id, ...entityWithoutId } = entity.toJSON() // Extract ownerId separately to use in the connect
    console.log('CREATE Pets - entity without id', entityWithoutId)

    const newappointment = await this.prismaService.appointment.create({
      data: {
        ...entityWithoutId,
      },
    })

    return AppointmentModelMapper.toEntity({
      ...newappointment,
      id: newappointment.id,
    })
  }

  async update(entity: AppointmentEntity): Promise<void> {
    await this._getById(entity._id)
    await this.prismaService.appointment.update({
      data: entity.toJSON(),
      where: {
        id: entity._id,
      },
    })
  }

  async delete(id: number): Promise<void> {
    await this._getById(id)
    await this.prismaService.appointment.delete({
      where: { id: Number(id) },
    })
  }

  findById(id: number): Promise<AppointmentEntity> {
    return this._getById(id)
  }

  async findAll(): Promise<AppointmentEntity[]> {
    const models = await this.prismaService.appointment.findMany()
    return models.map(model => AppointmentModelMapper.toEntity(model))
  }

  protected async _getById(id: number): Promise<AppointmentEntity> {
    const schedule = await this.prismaService.appointment.findUnique({
      where: { id: Number(id) },
    })

    if (!schedule) {
      throw new NotFoundError(`appointmentModel not found using ID ${id}`)
    }

    return AppointmentModelMapper.toEntity(schedule)
  }
}
