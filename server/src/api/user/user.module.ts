import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { TypesenseService } from 'src/typesense.service';
import { AuthService } from '../auth/auth.service';
import { EmailService } from 'src/email.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [
    UserService,
    PrismaService,
    TypesenseService,
    AuthService,
    EmailService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
