import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'email',
    default: 'test@gmail.com',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'password is too short',
  })
  @ApiProperty({ type: String, description: 'password', default: '123456' })
  public password: string;
}
