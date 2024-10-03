import { Module } from '@nestjs/common';
import { DentistController } from './dentist.controller';
import { DentistService } from './dentist.service';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from '../auth/auth.service';
import { EmailService } from 'src/email.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [
    DentistService,
    PrismaService,
    AuthService,
    EmailService,
  ],
  controllers: [DentistController],
  exports: [DentistService],
})
export class DentistModule {}
