import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from '../auth/auth.service';
import { EmailService } from 'src/email.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [
    UserService,
    PrismaService,
    AuthService,
    EmailService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
