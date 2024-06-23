import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Field } from './swagger_types/field-type';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('fields')
@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @ApiCreatedResponse({ type: Field })
  @ApiBadRequestResponse()
  create(@Body() createFieldDto: CreateFieldDto, @Request() req) {
    return this.fieldsService.create(createFieldDto, req.userId);
  }

  @Get(':projectId')
  @ApiOkResponse({ type: [Field] })
  findAll(@Param('projectId', ParseIntPipe) projectId: number, @Request() req) {
    return this.fieldsService.findAll(projectId, req.userId);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Field })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFieldDto: UpdateFieldDto,
    @Request() req,
  ) {
    return this.fieldsService.update(id, updateFieldDto, req.userId);
  }

  @Delete(':id')
  @ApiBadRequestResponse()
  @ApiNoContentResponse()
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.fieldsService.remove(id, req.userId);
  }
}
