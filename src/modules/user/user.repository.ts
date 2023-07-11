import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { calculatePagination } from 'src/common/utils/calculate-pagination';
import { UserEntity } from 'src/core/entities/user.entity';
import { IUserRepository } from 'src/core/interfaces/user-repository.interface';
import { RoleModel, UserModel, UserFriendModel } from 'src/typeorm/models';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private userModel: Repository<UserModel>,
    @InjectRepository(RoleModel)
    private roleModel: Repository<RoleModel>,
    @InjectRepository(UserFriendModel)
    private usersJunctionModel: Repository<UserFriendModel>,
  ) {}

  async assignRole(userId: number, roleName: string) {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new Error('No such user');
    }

    const role = await this.roleModel.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error('No such role');
    }
    user.roles.push(role);

    await this.userModel.save(user);
    return new UserEntity(user);
  }

  async getByLogin(login: string) {
    const user = await this.userModel.findOne({ where: { login: login } });
    if (!user) {
      return null;
    }
    return new UserEntity(user);
  }

  async addFriend(userId: number, friendId: number) {
    const user = await this.userModel.findOne({
      where: { id: userId },
      relations: {
        userFriend: true,
        friendUser: true,
      },
    });

    if (!user) {
      throw new BadRequestException(`No user with id ${userId}`);
    }

    if (user.userFriend.find((uf) => uf.friendId == friendId)) {
      throw new BadRequestException('Already friends');
    }

    const friend = await this.userModel.findOne({
      where: {
        id: friendId,
      },
    });

    if (!friend) {
      throw new BadRequestException(`No user with id ${friendId}`);
    }

    const userFriend = this.usersJunctionModel.create({
      user,
      friend,
    });

    const friendUser = this.usersJunctionModel.create({
      friend: user,
      user: friend,
    });

    user.userFriend.push(userFriend);
    user.friendUser.push(friendUser);
    await this.userModel.save(user);

    return friend;
  }

  async getByPublicId(publicId: string) {
    const user = await this.userModel.findOne({ where: { publicId } });
    if (!user) {
      return null;
    }
    return new UserEntity(user);
  }

  async get(id: number) {
    const user = await this.userModel.findOne({
      where: { id },
    });
    return new UserEntity(user);
  }

  async getFriends(id: number, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [junctions, count] = await this.usersJunctionModel.findAndCount({
      where: {
        userId: id,
      },
      relations: {
        friend: true,
      },
      skip,
      take,
    });

    const friends = junctions.map((junction) => junction.friend);

    const result = {
      result: friends.map((u) => u as UserEntity),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };
    return result;
  }

  async isFriend(userId: number, friendId: number) {
    const junction = await this.usersJunctionModel.findOne({
      where: {
        userId,
        friendId,
      },
    });

    return !!junction;
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const where = { ...filter };

    if (filter.username) {
      where['username'] = Like(`%${filter.username}%`);
    }

    const [users, count] = await this.userModel.findAndCount({
      where,
      take,
      skip,
    });
    const result = {
      result: users.map((u) => new UserEntity(u)),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };
    return result;
  }

  async create(data: Omit<UserEntity, 'id'>) {
    const user = this.userModel.create(data);
    const created = await this.userModel.save(user);

    const existing = await this.roleModel.findOne({ where: { name: 'USER' } });

    if (!existing) {
      const role = this.roleModel.create({ name: 'USER' });
      await this.roleModel.save(role);
    }
    return new UserEntity(created);
  }

  async update(id: number, data: Partial<Omit<UserEntity, 'id'>>) {
    const user = await this.userModel.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`No user with id ${id}`);
    }

    const updated = await this.userModel.save({ id: user.id, ...data });

    return new UserEntity(updated);
  }

  async delete(id: number) {
    await this.userModel.delete({ id });
    return true;
  }
}
