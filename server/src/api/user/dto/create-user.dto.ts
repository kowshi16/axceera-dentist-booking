import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Roles } from 'src/common/enums/roles.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User email address',
    default: 'test@gmail.com',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password is too short, it should be at least 6 characters',
  })
  @ApiProperty({
    type: String,
    description: 'User password',
    default: '123456',
  })
  public password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User bio',
    required: false,
    default: 'John',
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
    default: 'Smith',
  })
  public lastName?: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  @ApiProperty({ enum: Roles, description: 'Role of the user' })
  public role: Roles;
}
