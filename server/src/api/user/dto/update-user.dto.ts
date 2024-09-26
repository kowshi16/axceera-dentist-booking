import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Roles } from 'src/common/enums/roles.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User bio',
    required: false,
    default: 'updated bio',
  })
  public bio?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User display name',
    required: false,
    default: 'John Smith',
  })
  public username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User first name',
    required: false,
    default: 'John',
  })
  public firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User last name',
    required: false,
    default: 'Smith',
  })
  public lastName?: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  @ApiProperty({ enum: Roles, description: 'Role of the user' })
  public role: Roles;
  
}
