import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsMobilePhone,
  Length,
  IsNumber,
  Min,
  Max,
  IsDecimal,
} from 'class-validator';

export class CreateDentistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Full Name',
    default: 'John Smith',
  })
  public fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Dentist email address',
    default: 'test@gmail.com',
  })
  public email: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, {
    message: 'Address should have maximum of 50 characters',
  })
  @ApiProperty({
    type: String,
    description: 'Address',
    required: false,
    default: '12/1, East Street, Colombo 4',
  })
  public address?: string;

  @IsMobilePhone()
  @Length(10, 15)
  @ApiProperty({
    type: String,
    description: 'Mobile No',
    default: '0771234567',
  })
  public mobileNo: string;

  @IsDecimal()
  @ApiProperty({
    type: String,
    description: 'Rating',
    default: '4.5',
  })
  public ratings: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Qualification',
    default: 'BSc. Dental Science',
  })
  public qualification: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'About',
    default: 'About description goes here...',
  })
  public about: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Review',
    default: 'Great service',
  })
  public reviews?: string;

  @IsDecimal()
  @ApiProperty({
    type: String,
    description: 'Experience Years',
    default: '0',
  })
  public experienceYears: number;
}
