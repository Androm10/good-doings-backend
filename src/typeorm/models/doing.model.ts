import { Length, MaxLength } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserModel } from './user.model';

@Entity()
export class DoingModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Length(3, 100)
  @Column()
  name: string;

  @MaxLength(1000)
  @Column()
  description: string;

  @Column()
  userId: number;

  @ManyToOne(() => UserModel, (user) => user.doings)
  user: UserModel;
}
