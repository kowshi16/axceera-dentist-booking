import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DentistService } from './dentist.service';
import { CreateDentistDto } from './dto/create-dentist.dto';

@ApiTags('Dentist')
@Controller('dentist')
export class DentistController {
  constructor(private readonly dentistService: DentistService) {}

  // Get dentist by id
  @Get(':id')
  @ApiBearerAuth()
  async getDentistById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.dentistService.getDentistById(id);
  }

  @Get()
  @ApiBearerAuth()
  async getAllDentists(
    @Query('page') page: number = 1, 
    @Query('size') size: number = 10
  ) {
    return this.dentistService.getAllDentists(Number(page), Number(size));
  }

  // Register a dentist after logging in
  @Post('')
  @ApiBearerAuth()
  async createUser(@Body() body: CreateDentistDto, @Req() req: any): Promise<any> {
    return this.dentistService.createDentist(body);
  }

  // Delete dentist
  @Delete('/:id')
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: number): Promise<any> {
    return this.dentistService.deleteDentist(id);
  }
  
}
