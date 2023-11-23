/* eslint-disable prettier/prettier */
/* archivo: src/aeropuerto/aeropuerto.service.ts */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
   constructor(
       @InjectRepository(AeropuertoEntity)
       private readonly aeropuertoRepository: Repository<AeropuertoEntity>
   ){}

   async findAll(): Promise<AeropuertoEntity[]> {
       return await this.aeropuertoRepository.find({ relations: ["aerolineas"] });
   }

   async findOne(id: string): Promise<AeropuertoEntity> {
       const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id}, relations: ["aerolineas"] } );
       if (!aeropuerto)
         throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
  
       return aeropuerto;
   }
  
   async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {

        //if (aeropuerto.codigo.length == 3){
            return await this.aeropuertoRepository.save(aeropuerto);
        // }
        // else{
        //   throw new BusinessLogicException("El codigo debe tener 3 cifras", BusinessError.BAD_REQUEST)
        //}
   }

   async update(id: string, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
       const persistedAeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
       if (!persistedAeropuerto)
         throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
      
       aeropuerto.id = id; 
      
       return await this.aeropuertoRepository.save(aeropuerto);
   }

   async delete(id: string) {
       const aeropuerto: AeropuertoEntity = await this.aeropuertoRepository.findOne({where:{id}});
       if (!aeropuerto)
         throw new BusinessLogicException("The aeropuerto with the given id was not found", BusinessError.NOT_FOUND);
    
       await this.aeropuertoRepository.remove(aeropuerto);
   }
}
/* archivo: src/aeropuerto/aeropuerto.service.ts */
