import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from 'src/common/constants/inject-tokens';
import { UserEntity } from 'src/core/entities/user.entity';
import { IUserRepository } from 'src/core/interfaces/user-repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async get(id: number) {
    const user = await this.userRepository.get(id);
    if (!user) {
      throw new NotFoundException('No such user');
    }
    return user;
  }

  getFriends(id: number, limit?: number, page?: number) {
    return this.userRepository.getFriends(id, limit, page);
  }

  getAll(filter: any, limit?: number, page?: number) {
    return this.userRepository.getAll(filter, limit, page);
  }

  create(data: Omit<UserEntity, 'id' | 'publicId'>) {
    return this.userRepository.create(data);
  }

  async addFriendByPublicId(userId: number, publicId: string) {
    const friend = await this.userRepository.getByPublicId(publicId);
    if (!friend || friend.id == userId) {
      throw new BadRequestException('User with such id not found');
    }

    return this.userRepository.addFriend(userId, friend.id);
  }

  update(id: number, data: Partial<Omit<UserEntity, 'id'>>) {
    return this.userRepository.update(id, data);
  }

  delete(id: number) {
    return this.userRepository.delete(id);
  }

  getByLogin(login: string) {
    return this.userRepository.getByLogin(login);
  }

  async registerUser(data: {
    login: string;
    password: string;
    username: string;
  }) {
    const user = await this.userRepository.create(data);
    if (!user) {
      throw new BadRequestException('Cannot create user');
    }
    return await this.userRepository.assignRole(user.id, 'USER');
  }

  async isFriend(userId: number, friendId: number) {
    return this.userRepository.isFriend(userId, friendId);
  }
}
