import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoingModel } from 'src/typeorm/models';

@Module({
  imports: [TypeOrmModule.forFeature([DoingModel])],
})
export class DoingModule {}
