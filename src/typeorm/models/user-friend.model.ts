import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserModel } from './user.model';

@Entity()
export class UserFriendModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserModel, (user) => user.userFriend)
  user: UserModel;

  @Column()
  friendId: number;

  @ManyToOne(() => UserModel, (user) => user.friendUser)
  friend: UserModel;
}
