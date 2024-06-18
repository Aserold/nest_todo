import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: DatabaseService) {}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const project = await this.prisma.project.create({
      data: { ...createProjectDto, userId },
    });

    return project;
  }

  async findAll(userId: number) {
    return await this.prisma.project.findMany({
      where: { userId },
      include: { columns: { include: { tasks: true } } },
    });
  }

  async findOne(id: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id, userId },
      include: { columns: { include: { tasks: true } } },
    });

    if (!project) {
      throw new NotFoundException('Project Not Found');
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userId: number) {
    const project = await this.findOne(id, userId);
    return this.prisma.project.update({
      where: { id: project.id, userId: project.userId },
      data: { ...updateProjectDto },
      include: { columns: { include: { tasks: true } } },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await this.prisma.project.delete({
      where: { id, userId },
      include: { columns: { include: { tasks: true } } },
    });
  }
}
