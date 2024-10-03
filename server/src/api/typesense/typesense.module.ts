import { Module } from '@nestjs/common';
import { TypesenseService } from './typesense.service';
import { TypesenseController } from './typesense.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { EmailService } from 'src/email.service';
import { PrismaService } from 'src/prisma.service';
import { RoleService } from '../role/role.service';

@Module({
  providers: [
    UserService,
    PrismaService,
    AuthService,
    EmailService,
    TypesenseService,
    RoleService
  ],
  controllers: [TypesenseController],
  exports: [TypesenseService],
})
export class TypesenseModule {}