import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { MoveTaskDto } from './dto/move-task.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTask } from './swagger_types/create-type';
import { MoveTask } from './swagger_types/move-type';
import { FindallTasks } from './swagger_types/findall-type';

@UseGuards(AuthGuard)
@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':columnId')
  @ApiOkResponse({ type: [FindallTasks] })
  @ApiUnauthorizedResponse()
  findAll(@Param('columnId', ParseIntPipe) columnId: number, @Request() req) {
    return this.tasksService.findAll(columnId, req.userId);
  }

  @Post()
  @ApiCreatedResponse({ type: CreateTask })
  @ApiUnauthorizedResponse()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.userId);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CreateTask })
  @ApiUnauthorizedResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.tasksService.remove(id, req.userId);
  }

  @Put(':id/move')
  @ApiOkResponse({ type: MoveTask })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  move(
    @Param('id', ParseIntPipe) id: number,
    @Body() moveTaskDto: MoveTaskDto,
    @Request() req,
  ) {
    const { newPosition, columnId } = moveTaskDto;
    return this.tasksService.move(id, newPosition, columnId, req.userId);
  }
}
