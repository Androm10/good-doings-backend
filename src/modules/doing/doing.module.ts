import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOING_REPOSITORY } from 'src/common/constants/inject-tokens';
import { DoingModel } from 'src/typeorm/models';
import { UserModule } from '../user/user.module';
import { DoingController } from './doing.controller';
import { DoingRepository } from './doing.repository';
import { DoingService } from './doing.service';

@Module({
  controllers: [DoingController],
  imports: [TypeOrmModule.forFeature([DoingModel]), UserModule],
  providers: [
    DoingService,
    {
      useClass: DoingRepository,
      provide: DOING_REPOSITORY,
    },
  ],
})
export class DoingModule {}
