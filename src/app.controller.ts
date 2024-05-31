import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Ping')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'ping application' })
  @Get()
  ping() {
    return this.appService.ping()
  }
}
