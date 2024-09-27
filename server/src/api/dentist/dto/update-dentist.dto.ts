import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsMobilePhone, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class UpdateDentistDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'Full Name',
        default: 'John Smith',
    })
    public fullName?: string;

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
    @IsOptional()
    @Length(10, 15)
    @ApiProperty({
        type: String,
        description: 'Mobile No',
        default: '0771234567',
    })
    public mobileNo?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'Qualification',
        default: 'BSc. Dental Science',
    })
    public qualification?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'About',
        default: 'About description goes here...',
    })
    public about?: string;

    @IsDecimal()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'Experience Years',
        default: '0',
    })
    public experienceYears?: number;
}