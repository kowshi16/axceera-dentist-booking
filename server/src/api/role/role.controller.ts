import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { RolePermissionDto } from './dto/role-permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles('admin')
  @Get(':id')
  @ApiBearerAuth()
  async findRoleById(@Param('id') id: string) {
    return this.roleService.findRoleById(+id);
  }

  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  async findAllRoles() {
    return this.roleService.findAll();
  }

  //@Roles('admin')
  @Post()
  @Public()
  //@ApiBearerAuth()
  async createRole(@Body() createRoleDto: RoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Roles('admin')
  @Put(':id')
  @ApiBearerAuth()
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: RoleDto) {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth()
  async removeRole(@Param('id') id: string) {
    return this.roleService.deleteRole(+id);
  }

  @Roles('admin')
  @Post('permissions/assign')
  @ApiBearerAuth()
  async assignPermissionsToRole(@Body() rolePermissionDto: RolePermissionDto) {
    return this.roleService.assignPermissionsToRole(rolePermissionDto);
  }

  @Roles('admin')
  @Delete('permissions/revoke')
  @ApiBearerAuth()
  async removePermissionsFromRole(
    @Body() rolePermissionDto: RolePermissionDto,
  ) {
    return this.roleService.removePermissionsFromRole(rolePermissionDto);
  }

  @Roles('admin')
  @Get(':roleId/permissions')
  @ApiBearerAuth()
  async findPermissionsForRole(@Param('roleId') roleId: number) {
    return this.roleService.findPermissionsForRole(roleId);
  }
}
