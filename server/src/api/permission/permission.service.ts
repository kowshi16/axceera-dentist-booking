import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async findPermissionById(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async createPermission(data: PermissionDto) {
    try {
      return await this.prisma.permission.create({
        data,
      });
    } catch (error) {
      console.error('Error creating permission:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the permission.',
      );
    }
  }

  async updatePermission(id: number, data: PermissionDto) {
    // Check if the permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return await this.prisma.permission.update({
      where: { id: id },
      data,
    });
  }

  async deletePermission(id: number) {
    // Check if the permission exists
    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    // Proceed with the delete if the permission exists
    return await this.prisma.permission.delete({
      where: { id: id },
    });
  }
}
