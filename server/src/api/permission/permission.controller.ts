import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionDto } from './dto/permission.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';

@ApiTags('Permissions')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Roles('admin')
  @Get(':id')
  @ApiBearerAuth()
  async findPermissionById(@Param('id') id: string) {
    return this.permissionService.findPermissionById(+id);
  }

  @Roles('admin')
  @Get()
  @ApiBearerAuth()
  async findAllPermissions() {
    return this.permissionService.findAll();
  }

  @Roles('admin')
  @Post()
  @ApiBearerAuth()
  async createPermission(@Body() createPermissionDto: PermissionDto) {
    return this.permissionService.createPermission(createPermissionDto);
  }

  @Roles('admin')
  @Put(':id')
  @ApiBearerAuth()
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: PermissionDto,
  ) {
    return this.permissionService.updatePermission(+id, updatePermissionDto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth()
  async removePermission(@Param('id') id: string) {
    return this.permissionService.deletePermission(+id);
  }
}
