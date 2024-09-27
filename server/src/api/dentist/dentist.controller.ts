import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DentistService } from './dentist.service';
import { CreateDentistDto } from './dto/create-dentist.dto';
import { UpdateDentistDto } from './dto/update-dentist.dto';

@ApiTags('Dentist')
@Controller('dentist')
export class DentistController {
  constructor(private readonly dentistService: DentistService) { }

  // Get Dentist by ID
  @Get(':id')
  @ApiBearerAuth()
  async getDentistById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.dentistService.getDentistById(id);
  }

  // Get All Dentist
  @Get()
  @ApiBearerAuth()
  async getAllDentists(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10
  ) {
    return this.dentistService.getAllDentists(Number(page), Number(size));
  }

  // Create new Dentist
  @Post('')
  @ApiBearerAuth()
  async createUser(@Body() body: CreateDentistDto, @Req() req: any): Promise<any> {
    return this.dentistService.createDentist(body);
  }

  // Update Dentist
  @Put(':id')
  @ApiBearerAuth()
  async updateDentist(
    @Param('id') id: number,
    @Body() updateDentistDto: UpdateDentistDto
  ) {
    return this.dentistService.updateDentist(Number(id), updateDentistDto);
  }

  // Delete dentist
  @Delete('/:id')
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: number): Promise<any> {
    return this.dentistService.deleteDentist(id);
  }

}
