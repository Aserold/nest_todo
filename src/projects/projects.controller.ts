import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard, RequestWithUserId } from 'src/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Create } from './swagger_types/create-type';
import { FindallProjects } from './swagger_types/findall-type';
import { FindoneProject } from './swagger_types/findone-type';

@UseGuards(AuthGuard)
@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiCreatedResponse({ type: Create })
  @ApiUnauthorizedResponse()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: RequestWithUserId,
  ) {
    return this.projectsService.create(createProjectDto, req.userId);
  }

  @Get()
  @ApiOkResponse({ type: [FindallProjects] })
  @ApiUnauthorizedResponse()
  findAll(@Req() req: RequestWithUserId) {
    return this.projectsService.findAll(req.userId);
  }

  @Get(':id')
  @ApiOkResponse({ type: FindoneProject })
  @ApiUnauthorizedResponse()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUserId,
  ) {
    return this.projectsService.findOne(id, req.userId);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FindoneProject })
  @ApiUnauthorizedResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: RequestWithUserId,
  ) {
    return this.projectsService.update(id, updateProjectDto, req.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUserId) {
    return this.projectsService.remove(id, req.userId);
  }
}
