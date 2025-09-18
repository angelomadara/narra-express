import { AppDataSource } from '../config/database';
import { Earthquake, EarthquakeFilters } from '../models/earthquake.model';
import { CreateEarthquakeDTO, UpdateEarthquakeDTO } from '../dto/earthquake.dto';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

export class EarthquakeService {
  private earthquakeRepository: Repository<Earthquake>;

  constructor() {
    this.earthquakeRepository = AppDataSource.getRepository(Earthquake);
  }
  
  async createEarthquake(data: CreateEarthquakeDTO): Promise<Earthquake> {
    const earthquake = new Earthquake();
    earthquake.magnitude = data.magnitude;
    earthquake.location = data.location;
    earthquake.depth = data.depth;
    earthquake.date_time = data.date_time as Date;
    earthquake.latitude = data.latitude || undefined;
    earthquake.longitude = data.longitude || undefined;
    earthquake.source = data.source || undefined;

    return await this.earthquakeRepository.save(earthquake);
  }

  async getAllEarthquakes(filters: EarthquakeFilters = {}): Promise<Earthquake[]> {
    const queryBuilder = this.earthquakeRepository.createQueryBuilder('earthquake');

    if (filters.minMagnitude) {
      queryBuilder.andWhere('earthquake.magnitude >= :minMagnitude', { minMagnitude: filters.minMagnitude });
    }

    if (filters.maxMagnitude) {
      queryBuilder.andWhere('earthquake.magnitude <= :maxMagnitude', { maxMagnitude: filters.maxMagnitude });
    }

    if (filters.location) {
      queryBuilder.andWhere('earthquake.location LIKE :location', { location: `%${filters.location}%` });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('earthquake.date_time >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('earthquake.date_time <= :endDate', { endDate: filters.endDate });
    }

    queryBuilder.orderBy('earthquake.date_time', 'DESC');

    if (filters.limit) {
      queryBuilder.limit(filters.limit);
      
      if (filters.offset) {
        queryBuilder.offset(filters.offset);
      }
    }

    return await queryBuilder.getMany();
  }

  async getEarthquakeById(id: number): Promise<Earthquake> {
    const earthquake = await this.earthquakeRepository.findOne({ where: { id } });
    
    if (!earthquake) {
      throw new Error('Earthquake not found');
    }
    
    return earthquake;
  }

  async updateEarthquake(id: number, data: UpdateEarthquakeDTO): Promise<Earthquake> {
    const earthquake = await this.getEarthquakeById(id);
    
    // Update only provided fields
    Object.assign(earthquake, data);
    
    return await this.earthquakeRepository.save(earthquake);
  }

  async deleteEarthquake(id: number): Promise<void> {
    const result = await this.earthquakeRepository.delete(id);
    
    if (result.affected === 0) {
      throw new Error('Earthquake not found');
    }
  }

  async getEarthquakeCount(filters: EarthquakeFilters = {}): Promise<number> {
    const queryBuilder = this.earthquakeRepository.createQueryBuilder('earthquake');

    if (filters.minMagnitude) {
      queryBuilder.andWhere('earthquake.magnitude >= :minMagnitude', { minMagnitude: filters.minMagnitude });
    }

    if (filters.maxMagnitude) {
      queryBuilder.andWhere('earthquake.magnitude <= :maxMagnitude', { maxMagnitude: filters.maxMagnitude });
    }

    if (filters.location) {
      queryBuilder.andWhere('earthquake.location LIKE :location', { location: `%${filters.location}%` });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('earthquake.date_time >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('earthquake.date_time <= :endDate', { endDate: filters.endDate });
    }

    return await queryBuilder.getCount();
  }
}