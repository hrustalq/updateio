import { Controller, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';
import { HealthCheckService } from './health-check.service';
import {
  HealthCheckDto,
  ReadinessCheckDto,
  LivenessCheckDto,
} from './dto/health-check.dto';

@ApiTags('Health Check')
@Controller({
  version: '1',
  path: 'health',
})
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({
    type: HealthCheckDto,
    description: 'Service health status',
  })
  getStatus(): HealthCheckDto {
    return this.healthCheckService.getStatus();
  }

  @Public()
  @Get('readiness')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if service is ready to handle requests' })
  @ApiResponse({
    type: ReadinessCheckDto,
    description: 'Service readiness status including database health',
  })
  async getReadiness(): Promise<ReadinessCheckDto> {
    const dbStatus = await this.healthCheckService.checkDatabase();

    return {
      status: dbStatus ? 'ok' : 'error',
      checks: {
        database: dbStatus ? 'up' : 'down',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('liveness')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if service is alive' })
  @ApiResponse({
    type: LivenessCheckDto,
    description: 'Service liveness status',
  })
  getLiveness(): LivenessCheckDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
