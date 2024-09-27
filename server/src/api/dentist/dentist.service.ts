import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TypesenseService } from 'src/typesense.service';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role/role.service';
import { EmailService } from 'src/email.service';
import { Dentist, Prisma } from '@prisma/client';
import { CreateDentistDto } from './dto/create-dentist.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { UpdateDentistDto } from './dto/update-dentist.dto';

@Injectable()
export class DentistService {
  constructor(
    private prisma: PrismaService,
    private readonly typesenseService: TypesenseService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly roleService: RoleService,
  ) {}

  // Get Dentist by ID
  async getDentistById(id: number): Promise<Dentist> {
    const dentist = await this.prisma.dentist.findUnique({
      where: { id },
    });
  
    if (!dentist) {
      throw new NotFoundException(`Dentist with ID ${id} not found`);
    }
  
    return dentist;
  }

  // Get All Dentist
  async getAllDentists(page: number = 1, size: number = 10) {
    const skip = (page - 1) * size;

    const dentists = await this.prisma.dentist.findMany({
      skip,
      take: size,
    });

    const total = await this.prisma.dentist.count();

    return {
      data: dentists,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  // Create new Dentist
  async createDentist(
    data: CreateDentistDto,
  ): Promise<any> {
    // Check if dentist already exists
    const existDentist = await this.prisma.dentist.findUnique({
      where: { email: data.email },
    });
    if (existDentist) {
      throw new MethodNotAllowedException('Dentist already exists');
    } else {

      // Create the dentist
      const newDentist = await this.prisma.dentist.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          address: data.address,
          mobileNo: data.mobileNo,
          ratings: new Decimal(data.ratings),
          qualification: data.qualification,
          about: data.about,
          reviews: data.reviews,
          experienceYears: new Decimal(data.experienceYears),
        },
      });

      return newDentist;
    }
  }

  // Update Dentist details
  async updateDentist(id: number, updateDentistDto: UpdateDentistDto){
    // Check if the dentist exists
    const dentist = await this.prisma.dentist.findUnique({
      where: { id },
    });

    if (!dentist) {
      throw new NotFoundException(`Dentist with ID ${id} not found`);
    }

    // Update Dentist data
    return this.prisma.dentist.update({
      where: { id },
      data: updateDentistDto,
    });
  }

  // Delete Dentist
  async deleteDentist(id: number): Promise<any> {
    const dentist = await this.prisma.dentist.findUnique({
      where: { id },
    });

    if (!dentist) {
      throw new NotFoundException(`Dentist with ID ${id} not found`);
    }

    await this.prisma.dentist.delete({
      where: { id },
    });

    return { message: `Dentist with ID ${id} has been deleted` };
  }

}
