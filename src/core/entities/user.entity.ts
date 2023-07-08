import { Entity } from './entity';

export class UserEntity extends Entity {
  id: number;
  publicId: string;
  username: string;
  login: string;
  password: string;
  friends?: UserEntity[];

  constructor(data: UserEntity) {
    super();
    Object.assign(this, data);
  }
}
