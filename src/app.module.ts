import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './config/auth.config';
import baseConfig from './config/base.config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import throttlerConfig from './config/throttler.config';
import { AppTypeOrmModule } from './typeorm/typeorm.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ModulesModule } from './modules/module.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENVIRONMENT}.env`,
      load: [
        baseConfig,
        databaseConfig,
        authConfig,
        throttlerConfig,
        redisConfig,
      ],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        limit: configService.get<number>('throttler.limit'),
        ttl: configService.get<number>('throttler.ttl'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: await redisStore({
          url: configService.get('redis.uri'),
          ttl: 4000,
        }),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
    AppTypeOrmModule,
    ModulesModule,
  ],
})
export class AppModule {}
