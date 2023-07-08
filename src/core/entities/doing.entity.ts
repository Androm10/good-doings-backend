import { Entity } from './entity';
import { UserEntity } from './user.entity';

export class DoingEntity extends Entity {
  id: number;
  name: string;
  description: string;
  userId: number;
  user?: UserEntity;

  constructor(data: DoingEntity) {
    super();
    Object.assign(this, data);
  }
}
