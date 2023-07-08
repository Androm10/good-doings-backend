import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BeforeInsert,
  OneToMany,
  JoinTable,
} from 'typeorm';
import crypto from 'crypto';
import { hashPasword as hash } from 'src/common/utils/bcrypt';
import { RoleModel } from './role.model';
import { IsEmail, Length } from 'class-validator';
import { DoingModel } from './doing.model';
import { UserFriendModel } from './user-friend.model';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  publicId: string;

  @IsEmail()
  @Length(3, 100)
  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Length(3, 60)
  @Column()
  username: string;

  @OneToMany(() => DoingModel, (doing) => doing.user)
  doings: DoingModel[];

  @OneToMany(() => UserFriendModel, (userFriend) => userFriend.user, {
    cascade: true,
  })
  userFriend: UserFriendModel[];

  @OneToMany(() => UserFriendModel, (friendUser) => friendUser.friend, {
    cascade: true,
  })
  friendUser: UserFriendModel[];
  // @JoinTable({
  //   name: 'users_users',
  //   joinColumn: {
  //     name: 'userId1',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'userId2',
  //     referencedColumnName: 'id',
  //   },
  // })
  // @ManyToMany(() => UserModel, (user) => user.friends)
  // friends: UserModel[];

  @JoinTable()
  @ManyToMany(() => RoleModel, (role) => role.users)
  roles: RoleModel[];

  @BeforeInsert()
  async beforeInsert() {
    this.password = await hashPassword(this.password);
    this.publicId = crypto.randomUUID();
  }
}

async function hashPassword(password: string) {
  return hash(password);
}
