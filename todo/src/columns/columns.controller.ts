import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { NewPositionDto } from './dto/new-position.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindallColumns } from './swagger_types/findall-type';
import { CreateColumn } from './swagger_types/create-type';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('columns')
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get(':projectId')
  @ApiOkResponse({ type: [FindallColumns] })
  findAll(@Param('projectId', ParseIntPipe) projectId: number, @Request() req) {
    return this.columnsService.findAll(projectId, req.userId);
  }

  @Post()
  @ApiCreatedResponse({ type: CreateColumn })
  create(@Body() createColumnDto: CreateColumnDto, @Request() req) {
    return this.columnsService.create(createColumnDto, req.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateColumnDto: UpdateColumnDto,
    @Request() req,
  ) {
    return this.columnsService.update(id, updateColumnDto, req.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.columnsService.delete(id, req.userId);
  }

  @Put(':id/move')
  @ApiOkResponse({ type: [FindallColumns] })
  move(
    @Param('id', ParseIntPipe) id: number,
    @Body() newPositionDto: NewPositionDto,
    @Request() req,
  ) {
    return this.columnsService.move(id, newPositionDto.newPosition, req.userId);
  }
}
