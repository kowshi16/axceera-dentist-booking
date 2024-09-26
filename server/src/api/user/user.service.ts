import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';
import { TypesenseService } from 'src/typesense.service';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role/role.service';
import { Roles } from 'src/common/enums/roles.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly typesenseService: TypesenseService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly roleService: RoleService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(
    data: CreateUserDto,
    createdBy: number | null,
  ): Promise<any> {
    // Check if user already exists
    const existUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existUser) {
      throw new MethodNotAllowedException('User already exists');
    } else {
      // Hash password
      const hashedPassword = await this.authService.hashPassword(data.password);
      data['password'] = hashedPassword;

      // Find the role
      const role = await this.prisma.role.findUnique({
        where: { name: data.role },
      });
      if (!role) {
        throw new BadRequestException('Role does not exist');
      }

      // Create the user
      const newUser = await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
          bio: data.bio,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          role: {
            connect: { id: role.id },
          },
        },
      });

      // Update createdBy field after user is created
      await this.prisma.user.update({
        where: { id: newUser.id },
        data: {
          createdBy: createdBy || newUser.id, // Use logged-in user or self
        },
      });

      // Create the role-specific record based on the user's role
      switch (data.role) {
        case Roles.ADMIN:
          // No additional role-specific record creation needed for this role
          break;

        default:
          throw new BadRequestException('Invalid role');
      }
      return newUser;
    }
  }

  async updateUser(data: UpdateUserDto, userId: number): Promise<User> {
    // Fetch the current user to check the role
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });
    if (!currentUser) {
      throw new BadRequestException('User not found');
    }

    // Update the user record (excluding role-specific data)
    const { ...userData } = data;

    // Update the user record
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...userData,
        role: {
          connect: { id: currentUser.roleId },
        },
      },
    });

    // Update role-specific data
    switch (currentUser.role.name) {
      case Roles.ADMIN:
        // No role-specific data to update for admin
        break;

      default:
        throw new BadRequestException('Invalid role');
    }

    return updatedUser;
  }

  async deleteUser(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async changePassword(data: ChangePasswordDto, userId: number): Promise<any> {
    const { newPassword, oldPassword } = data;

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (user) {
      const isPassOk = await this.authService.comparePassword(
        oldPassword,
        user.password,
      );
      if (isPassOk) {
        const hashedNewPassword =
          await this.authService.hashPassword(newPassword);
        const updatedUserRes = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: hashedNewPassword,
          },
        });
        return updatedUserRes;
      } else {
        throw new UnauthorizedException(`Password doesn't match`);
      }
    } else {
      throw new NotFoundException();
    }
  }

  async getUserRoleById(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });
    return user.role.name;
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      // Fetch the user from the database
      const user = await this.prisma.user.findFirst({
        where: { email },
      });

      // Check if user exists
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Fetch the role name using the roleId
      const role = await this.roleService.findRoleById(user.roleId);

      if (!role) throw new BadRequestException('User role not found.');

      const token = await this.authService.createAccessToken(
        user.id,
        email,
        role.name,
      );

      // Generate reset link
      const link = `${process.env.FRONTEND_URL}/auth/new-password?token=${token}`;

      // Send reset email
      const resp = await this.emailService.sendPasswordResetLink(email, link);

      return resp;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async newPassword(token: string, newPassword: string): Promise<any> {
    try {
      // Verify the token
      const decodedJWT = await this.authService.verifyToken(token);

      if (decodedJWT) {
        // Hash the new password
        const hashedNewPassword =
          await this.authService.hashPassword(newPassword);

        // Update the user's password in the database
        const updatedUser = await this.prisma.user.update({
          where: { id: decodedJWT.id },
          data: { password: hashedNewPassword },
        });
        return updatedUser;
      }
      throw new BadRequestException('Invalid token found');
    } catch (error) {
      throw error;
    }
  }

  async getUserPermissions(userId: number): Promise<any> {
    // Find the user persmissions along with their role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true, // Include the related Permission details
              },
            },
          },
        },
      },
    });

    // Check if the user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Extract permissions
    const permissions = user.role.permissions.map(
      (rolePermission) => rolePermission.permission.name,
    );

    return { userId: user.id, role: user.role.name, permissions };
  }
}
