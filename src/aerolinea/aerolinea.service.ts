/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find({ relations: ["aeropuertos"] });
    }
    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}, relations: ["aeropuertos"] } );
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);
   
        return aerolinea;
    }
    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        // const fecha = new Date(aerolinea.fechaFundacion);
        // if (fecha.getTime() > new Date().getTime() ){
        //   throw new BusinessLogicException('La fecha de fundacion no puede se mayor a la fecha actual', BusinessError.BAD_REQUEST)
        // }
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!persistedAerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.aerolineaRepository.save({...persistedAerolinea, ...aerolinea});
    }

    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
          throw new BusinessLogicException("The aerolinea with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.aerolineaRepository.remove(aerolinea);
    }


}
