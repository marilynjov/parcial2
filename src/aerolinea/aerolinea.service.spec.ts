/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';

import { faker } from '@faker-js/faker';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];
    for(let i = 0; i < 5; i++){
        const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.string.alphanumeric(10),
        descripcion: faker.string.alphanumeric(10),
        fechaFundacion: faker.string.alphanumeric(10),
        paginaWeb: faker.string.alphanumeric(10)
        })
        aerolineasList.push(aerolinea);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne should return a aerolinea by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre)
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion)
    expect(aerolinea.fechaFundacion).toEqual(storedAerolinea.fechaFundacion)
    expect(aerolinea.paginaWeb).toEqual(storedAerolinea.paginaWeb)
  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found")
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.string.alphanumeric(10),
      descripcion: faker.string.alphanumeric(10),
      fechaFundacion: faker.string.alphanumeric(10),
      paginaWeb: faker.string.alphanumeric(10),
      aeropuertos: []
    }

    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion)
    expect(storedAerolinea.fechaFundacion).toEqual(newAerolinea.fechaFundacion)
    expect(storedAerolinea.paginaWeb).toEqual(newAerolinea.paginaWeb)
  });

  it('update should modify a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea.nombre = "New name";
    aerolinea.descripcion = "New descripcion";
  
    const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updatedAerolinea).not.toBeNull();
  
    const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion)
  });
 
  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea, nombre: "New name", descripcion: "New descripcion"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "The aerolinea with the given id was not found")
  });

  it('delete should remove a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
  
    const deletedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deletedAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The aerolinea with the given id was not found")
  });
 
});