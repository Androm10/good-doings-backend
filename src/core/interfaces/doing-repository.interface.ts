import { DoingEntity } from '../entities/doing.entity';
import { IRepository } from './repository.interface';

export type IDoingRepository = IRepository<DoingEntity>;
