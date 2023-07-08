import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DOING_REPOSITORY } from 'src/common/constants/inject-tokens';
import { DoingEntity } from 'src/core/entities/doing.entity';
import { IDoingRepository } from 'src/core/interfaces/doing-repository.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class DoingService {
  constructor(
    @Inject(DOING_REPOSITORY) private doingRepository: IDoingRepository,
    private userService: UserService,
  ) {}

  async get(id: number, userId: number) {
    const doing = await this.doingRepository.get(id);

    if (userId == doing.userId) {
      return doing;
    }

    const isFriend = await this.userService.isFriend(userId, doing.userId);

    if (!doing || !isFriend) {
      throw new NotFoundException('No such doing');
    }
    return doing;
  }

  getAll(filter: any, limit?: number, page?: number) {
    return this.doingRepository.getAll(filter, limit, page);
  }

  create(data: Omit<DoingEntity, 'id'>) {
    return this.doingRepository.create(data);
  }

  async update(
    id: number,
    data: Partial<Omit<DoingEntity, 'id'>>,
    userId: number,
  ) {
    const doing = await this.doingRepository.get(id);

    if (!doing) {
      throw new BadRequestException('No doing with id');
    }

    if (doing.userId !== userId) {
      throw new ForbiddenException('Cannot update foreign doings');
    }

    return this.doingRepository.update(id, data);
  }

  async delete(id: number, userId: number) {
    const doing = await this.doingRepository.get(id);

    if (!doing) {
      return false;
    }

    if (doing.userId !== userId) {
      throw new ForbiddenException('Cannot delete foreign doings');
    }

    return this.doingRepository.delete(id);
  }
}
