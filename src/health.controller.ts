import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get('status')
  @ApiResponse({
    status: 200,
    description: 'Returns the health status of the application',
  })
  getHealthStatus(): { status: string } {
    return { status: 'OK' };
  }
}
