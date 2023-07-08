import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DoingModule } from './doing/doing.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, DoingModule],
  exports: [AuthModule, UserModule, DoingModule],
})
export class ModulesModule {}
