import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoingModel, RoleModel, UserModel, UserFriendModel } from './models';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get('database.dialect'),
        url: configService.get('database.uri'),
        synchronize: process.env.NODE_ENVIRONMENT == 'dev',
        autoLoadEntities: true,
        entities: [UserModel, RoleModel, DoingModel, UserFriendModel],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppTypeOrmModule {}
