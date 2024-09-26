import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { AuthController } from './api/auth/auth.controller';
import { AuthService } from './api/auth/auth.service';
import { AuthModule } from './api/auth/auth.module';
import { TokenModule } from './api/token/token.module';
import { RoleModule } from './api/role/role.module';
import { PermissionModule } from './api/permission/permission.module';
import { DentistModule } from './api/dentist/dentist.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TokenModule,
    RoleModule,
    PermissionModule,
    DentistModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
