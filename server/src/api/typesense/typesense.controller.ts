import { Body, Controller, Post } from '@nestjs/common';
import { TypesenseService } from './typesense.service';
import { Public } from 'src/common/decorator/public.decorator';
import { searchDto } from './typesense.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Typesense')
@Controller('typesense')
export class TypesenseController {
    constructor(private readonly typesenseService: TypesenseService) { }

    /*create dentist collection*/
    @Public()
    @Post('/create')
    async createDentist(): Promise<any> {
        return this.typesenseService.createDentistCollection();
    }

    /*search from dentist collection*/
    @Public()
    @Post('/search')
    async searchDentist(@Body() body: searchDto): Promise<any> {
        return this.typesenseService.searchFromTypesenseCollection(body);
    }
}
