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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard, RequestWithUserId } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: RequestWithUserId,
  ) {
    return this.projectsService.create(createProjectDto, req.userId);
  }

  @Get()
  findAll(@Req() req: RequestWithUserId) {
    return this.projectsService.findAll(req.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUserId) {
    return this.projectsService.findOne(+id, req.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: RequestWithUserId,
  ) {
    return this.projectsService.update(+id, updateProjectDto, req.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: RequestWithUserId) {
    return this.projectsService.remove(+id, req.userId);
  }
}
