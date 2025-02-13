import { Test, TestingModule } from '@nestjs/testing'
import { ClinicController } from './clinic.controller'
import { CreateClinicUseCase } from '../application/usecases/create-clinic.usecase'
import { ListClinicsUseCase } from '../application/usecases/list-clinics.usecase'
import { DeleteClinicUseCase } from '../application/usecases/delete-clinic.usecase'
import { GetClinicUseCase } from '../application/usecases/get-clinic.usecase'
import { ClinicOutput } from '../application/dtos/clinic.output'
import { CreateClinicDto } from './dtos/create-clinic.dto'
import { ListClinicsDto } from './dtos/list-clinics.dto'

describe('ClinicController', () => {
  let controller: ClinicController
  let createClinicUseCase: CreateClinicUseCase.UseCase
  let listClinicsUseCase: ListClinicsUseCase.UseCase
  let deleteClinicUseCase: DeleteClinicUseCase.UseCase
  let getClinicUseCase: GetClinicUseCase.UseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicController],
      providers: [
        {
          provide: CreateClinicUseCase.UseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListClinicsUseCase.UseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteClinicUseCase.UseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetClinicUseCase.UseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile()

    controller = module.get<ClinicController>(ClinicController)
    createClinicUseCase = module.get<CreateClinicUseCase.UseCase>(
      CreateClinicUseCase.UseCase,
    )
    listClinicsUseCase = module.get<ListClinicsUseCase.UseCase>(
      ListClinicsUseCase.UseCase,
    )
    deleteClinicUseCase = module.get<DeleteClinicUseCase.UseCase>(
      DeleteClinicUseCase.UseCase,
    )
    getClinicUseCase = module.get<GetClinicUseCase.UseCase>(
      GetClinicUseCase.UseCase,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a clinic', async () => {
      const createClinicDto: CreateClinicDto = {
        name: 'Animal Care',
        number: 123,
        street: 'Pet Street',
        neighborhood: 'Pet Neighborhood',
        city: 'City',
        state: 'ST',
        zipCode: '12345-678',
        cnpj: '123456789',
      }
      const clinicOutput: ClinicOutput = { id: 1, ...createClinicDto }
      jest.spyOn(createClinicUseCase, 'execute').mockResolvedValue(clinicOutput)

      const result = await controller.create(createClinicDto)

      expect(result).toEqual(clinicOutput)
      expect(createClinicUseCase.execute).toHaveBeenCalledWith(createClinicDto)
    })
  })

  describe('search', () => {
    it('should return a list of clinics', async () => {
      const listClinicsDto: ListClinicsDto = {
        filter: '',
        page: 1,
        perPage: 10,
      }
      const clinicsOutput = {
        items: [
          {
            id: 1,
            name: 'Animal Care',
            number: 123,
            street: 'Pet Street',
            neighborhood: 'Pet Neighborhood',
            city: 'City',
            state: 'ST',
            zipCode: '12345-678',
            cnpj: '123456789',
          },
        ],
        total: 1,
        currentPage: 1,
        perPage: 10,
        lastPage: 1,
      }
      console.log(clinicsOutput)
      jest.spyOn(listClinicsUseCase, 'execute').mockResolvedValue(clinicsOutput)

      const result = await controller.search(listClinicsDto)

      console.log(result)
      expect(result).toEqual(clinicsOutput)
      expect(listClinicsUseCase.execute).toHaveBeenCalledWith(listClinicsDto)
    })
  })

  describe('findOne', () => {
    it('should return a single clinic', async () => {
      const clinicId = 1
      const clinicOutput: ClinicOutput = {
        id: clinicId,
        name: 'Animal Care',
        number: 123,
        street: 'Pet Street',
        neighborhood: 'Pet Neighborhood',
        city: 'City',
        state: 'ST',
        zipCode: '12345-678',
        cnpj: '123456789',
      }
      jest.spyOn(getClinicUseCase, 'execute').mockResolvedValue(clinicOutput)

      const result = await controller.findOne(clinicId)

      expect(result).toEqual(clinicOutput)
      expect(getClinicUseCase.execute).toHaveBeenCalledWith({ id: clinicId })
    })
  })

  describe('remove', () => {
    it('should delete a clinic', async () => {
      const clinicId = 1
      jest.spyOn(deleteClinicUseCase, 'execute').mockResolvedValue(undefined)

      await controller.remove(clinicId)

      expect(deleteClinicUseCase.execute).toHaveBeenCalledWith({ id: clinicId })
    })
  })
})
