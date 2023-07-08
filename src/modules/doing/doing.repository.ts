import { DoingEntity } from 'src/core/entities/doing.entity';
import { IDoingRepository } from 'src/core/interfaces/doing-repository.interface';
import { Paginated } from 'src/core/interfaces/repository.interface';

export class DoingRepository implements IDoingRepository {
  get(id: number): Promise<DoingEntity> {
    throw new Error('Method not implemented.');
  }
  getAll(
    filter: any,
    limit?: number,
    page?: number,
  ): Promise<Paginated<DoingEntity>> {
    throw new Error('Method not implemented.');
  }
  create(data: Omit<DoingEntity, 'id'>): Promise<DoingEntity> {
    throw new Error('Method not implemented.');
  }
  update(
    id: number,
    data: Partial<Omit<DoingEntity, 'id'>>,
  ): Promise<DoingEntity> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
