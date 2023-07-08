import { InjectRepository } from '@nestjs/typeorm';
import { calculatePagination } from 'src/common/utils/calculate-pagination';
import { DoingEntity } from 'src/core/entities/doing.entity';
import { IDoingRepository } from 'src/core/interfaces/doing-repository.interface';
import { Paginated } from 'src/core/interfaces/repository.interface';
import { DoingModel } from 'src/typeorm/models';
import { Like, Repository } from 'typeorm';

export class DoingRepository implements IDoingRepository {
  constructor(
    @InjectRepository(DoingModel) private doingModel: Repository<DoingModel>,
  ) {}

  async get(id: number) {
    const doing = await this.doingModel.findOne({ where: { id } });
    if (!doing) {
      return null;
    }

    return new DoingEntity(doing);
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const where = { ...filter };

    if (filter.name) {
      where['name'] = Like(`%${filter.name}%`);
    }

    if (filter.description) {
      where['description'] = Like(`%${filter.description}%`);
    }

    const [doings, count] = await this.doingModel.findAndCount({
      where,
      take,
      skip,
    });
    const result = {
      result: doings.map((d) => new DoingEntity(d)),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };
    return result;
  }

  async create(data: Omit<DoingEntity, 'id'>) {
    const doing = this.doingModel.create(data);
    const created = await this.doingModel.save(doing);
    return new DoingEntity(created);
  }

  async update(id: number, data: Partial<Omit<DoingEntity, 'id'>>) {
    const doing = await this.doingModel.findOne({ where: { id } });

    if (!doing) {
      return null;
    }

    const updated = await this.doingModel.save({ id: doing.id, ...data });

    return new DoingEntity(updated);
  }

  async delete(id: number) {
    await this.doingModel.delete({ id });
    return true;
  }
}
