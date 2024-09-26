import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsArray, ArrayNotEmpty, ArrayUnique, IsNotEmpty } from 'class-validator';

export class RolePermissionDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Role ID',
  })
  public roleId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ApiProperty({
    type: [Number],
    description: 'Array of Permission IDs',
  })
  public permissions: number[];
}
