import { Controller, Get } from '@nestjs/common';

import { SeederService } from './seeder.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('seeders')
@ApiTags('Seeder')
export class SeederController {
  constructor(private seederService: SeederService) {}

  @Get('create-admin')
  async createAdmin() {
    return await this.seederService.createAdmin();
  }
}
