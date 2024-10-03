import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class searchDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'collection name',
    default: 'dentist',
  })
  public name: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'search text',
    default: 'test',
  })
  public q: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'query_by field names',
    default: 'fullName,email,address,mobileNo,ratings,qualification,about,reviews,experienceYears',
  })
  public query_by: string;

//   @IsString()
//   @ApiProperty({
//     type: String,
//     description: 'num_employees:>100',
//     default: '',
//   })
//   public filter_by: string;

//   @IsString()
//   @ApiProperty({
//     type: String,
//     description: 'num_employees:des',
//     default: '',
//   })
//   public sort_by: string;
}
