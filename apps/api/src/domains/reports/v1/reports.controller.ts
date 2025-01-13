import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportsV1Service } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportDto } from './dto/report.dto';
import { ApiResponse } from '../../../common/decorators/api-response.decorator';

@ApiTags('Reports')
@Controller({ path: 'reports', version: '1' })
export class ReportsV1Controller {
  constructor(private readonly reportsService: ReportsV1Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ type: ReportDto, status: 201 })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({
    status: 200,
    description: 'Returns all reports',
    isArray: true,
    type: ReportDto,
  })
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.reportsService.findByUser(userId);
    }
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the report',
    type: ReportDto,
  })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a report' })
  @ApiResponse({
    status: 200,
    description: 'The report has been successfully updated.',
    type: ReportDto,
  })
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({
    status: 200,
    description: 'The report has been successfully deleted.',
    type: ReportDto,
  })
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
