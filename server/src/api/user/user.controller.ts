import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, User as UserModel } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateNewPasswordDto } from './dto/create-new-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get logged in user's info
  @Get()
  @ApiBearerAuth()
  async getLoggedInUser(@Req() req): Promise<UserModel> {
    return this.userService.user({ id: req.user.id });
  }

  @Get(':userId')
  @ApiBearerAuth()
  async getUserById(@Param('userId') userId: number): Promise<UserModel> {
    return this.userService.user({ id: userId });
  }

  //  Get all users
  @Get('users/all')
  @ApiBearerAuth()
  async getUsers(@Req() req): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = req.query;

    return this.userService.users({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      cursor: cursor ? JSON.parse(cursor) : undefined,
      where: where ? JSON.parse(where) : undefined,
      orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    });
  }

  // Register a user after logging in
  @Post('')
  @ApiBearerAuth()
  async createUser(@Body() body: CreateUserDto, @Req() req: any): Promise<any> {
    // Extract the logged-in user's ID from the request and pass it to the service
    const createdBy = req.user?.id;
    return this.userService.createUser(body, createdBy);
  }

  // Register a user without logging in
  @Public()
  @Post('request')
  async createUserRequest(@Body() body: CreateUserDto): Promise<any> {
    const createdBy = null;
    return this.userService.createUser(body, createdBy);
  }

  // Update logged user info
  @Put('')
  @ApiBearerAuth()
  async updateUser(@Body() body: UpdateUserDto, @Req() req): Promise<any> {
    return this.userService.updateUser(body, req.user.id);
  }

  // Delete user by admin
  @Roles('admin')
  @Delete('/:userId')
  @ApiBearerAuth()
  async deleteUser(@Param('userId') userId: number): Promise<any> {
    return this.userService.deleteUser(userId);
  }

  // Change password by a logged in user
  @Post('change-password')
  @ApiBearerAuth()
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req,
  ): Promise<any> {
    return this.userService.changePassword(body, req?.user?.id);
  }

  // Reset password
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<any> {
    return this.userService.resetPassword(body?.email);
  }

  // Create a new password after receiving the email
  @Public()
  @Post('new-password')
  async createNewPassword(@Body() body: CreateNewPasswordDto): Promise<any> {
    return this.userService.newPassword(body?.token, body?.newPassword);
  }

  //  Get permissions for each user
  @Roles('admin')
  @Get(':id/permissions')
  @ApiBearerAuth()
  async getUserPermissions(@Param('id') userId: string) {
    const permissions = await this.userService.getUserPermissions(+userId);
    if (!permissions) {
      throw new NotFoundException('Permissions not found for this user');
    }
    return permissions;
  }
}
