import { UserEntity } from '../entities/user.entity';
import { IRepository, Paginated } from './repository.interface';

export interface IUserRepository extends IRepository<UserEntity> {
  create(data: Omit<UserEntity, 'id' | 'publicId'>): Promise<UserEntity>;
  getByLogin(login: string): Promise<UserEntity>;
  getByPublicId(publicId: string): Promise<UserEntity>;
  assignRole(userId: number, roleName: string): Promise<UserEntity>;
  addFriend(userId: number, friendId: number): Promise<UserEntity>;
  getFriends(
    id: number,
    limit?: number,
    page?: number,
  ): Promise<Paginated<UserEntity>>;
  isFriend(userId: number, friendId: number): Promise<boolean>;
}
