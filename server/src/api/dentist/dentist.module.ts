import { Module } from '@nestjs/common';
import { DentistController } from './dentist.controller';
import { DentistService } from './dentist.service';
import { PrismaService } from 'src/prisma.service';
import { TypesenseService } from 'src/typesense.service';
import { AuthService } from '../auth/auth.service';
import { EmailService } from 'src/email.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [
    DentistService,
    PrismaService,
    TypesenseService,
    AuthService,
    EmailService,
  ],
  controllers: [DentistController],
  exports: [DentistService],
})
export class DentistModule {}
