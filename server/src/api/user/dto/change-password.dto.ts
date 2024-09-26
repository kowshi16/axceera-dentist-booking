import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password is too short, it should be at least 6 characters',
  })
  @ApiProperty({
    type: String,
    description: 'current password',
    default: '123456',
  })
  public oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password is too short, it should be at least 6 characters',
  })
  @ApiProperty({
    type: String,
    description: 'New password',
    default: '1234567',
  })
  public newPassword: string;
}
