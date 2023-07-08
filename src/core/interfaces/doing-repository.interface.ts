import { DoingEntity } from '../entities/doing.entity';
import { IRepository } from './repository.interface';

export interface IDoingRepository extends IRepository<DoingEntity> {
  get(id: number, userId?: number): Promise<DoingEntity>;
}
