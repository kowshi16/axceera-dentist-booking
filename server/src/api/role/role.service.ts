import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoleDto } from './dto/role.dto';
import { RolePermissionDto } from './dto/role-permission.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findRoleById(id: number) {
    return this.prisma.role.findUnique({
      where: { id: id },
    });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async createRole(data: RoleDto) {
    const existingRole = await this.prisma.role.findUnique({
      where: { name: data.name },
    });

    if (existingRole) {
      throw new Error('Role already exists');
    }

    return this.prisma.role.create({
      data,
    });
  }

  async updateRole(id: number, data: RoleDto) {
    // Check if the role exists
    const role = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Proceed with the update if the role exists
    return this.prisma.role.update({
      where: { id: id },
      data,
    });
  }

  async deleteRole(id: number) {
    // Check if the role exists
    const role = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return await this.prisma.role.delete({
      where: { id: id },
    });
  }

  async assignPermissionsToRole(rolePermissionDto: RolePermissionDto) {
    const { roleId, permissions } = rolePermissionDto;

    // Check if the role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Check if all permissions exist
    for (const permissionId of permissions) {
      const permission = await this.prisma.permission.findUnique({
        where: { id: permissionId },
      });
      if (!permission) {
        throw new NotFoundException(
          `Permission with ID ${permissionId} not found`,
        );
      }
    }

    // Create the role-permission relations
    const rolePermissions = permissions.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    // Add permissions to a role
    return this.prisma.rolePermission.createMany({
      data: rolePermissions,
      skipDuplicates: true, // Prevent duplicate entries
    });
  }

  async removePermissionsFromRole(rolePermissionDto: RolePermissionDto) {
    const { roleId, permissions } = rolePermissionDto;

    try {
      // Ensure the role exists
      const roleExists = await this.prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!roleExists) {
        throw new NotFoundException('Role not found');
      }

      // Ensure permissions exist
      const existingPermissions = await this.prisma.permission.findMany({
        where: { id: { in: permissions } },
        select: { id: true },
      });

      const existingPermissionIds = existingPermissions.map((p) => p.id);

      // Check if any permission ID is not found
      const notFoundPermissions = permissions.filter(
        (p) => !existingPermissionIds.includes(p),
      );
      if (notFoundPermissions.length > 0) {
        throw new NotFoundException(
          `One or more permissions not found: ${notFoundPermissions.join(', ')}`,
        );
      }

      // Remove permissions from a role
      const result = await this.prisma.rolePermission.deleteMany({
        where: {
          roleId,
          permissionId: {
            in: permissions,
          },
        },
      });

      return result;
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error removing permissions from role:', error);
      throw new InternalServerErrorException(
        'An error occurred while removing permissions from the role.',
      );
    }
  }

  async findPermissionsForRole(roleId: number) {
    // Find permissions for a role
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Check if the role exists
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Extract permissions
    const permissions = role.permissions.map(
      (rolePermission) => rolePermission.permission.name,
    );

    return { role: role.name, permissions };
  }
}
