import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FieldsService {
  constructor(private prisma: DatabaseService) {}

  async create(createFieldDto: CreateFieldDto, userId: number) {
    const { projectId, name, fieldType } = createFieldDto;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new BadRequestException('Project not found or unauthorized');
    }

    return this.prisma.taskField.create({
      data: {
        projectId,
        name,
        fieldType,
      },
    });
  }

  async findAll(projectId: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new BadRequestException('Project not found or unauthorized');
    }

    return this.prisma.taskField.findMany({
      where: { projectId },
    });
  }

  async update(id: number, updateFieldDto: UpdateFieldDto, userId: number) {
    const taskField = await this.prisma.taskField.findUnique({
      where: { id },
      include: { project: { select: { userId: true } } },
    });

    if (!taskField || taskField.project.userId !== userId) {
      throw new BadRequestException('Project not found or unauthorized');
    }

    return this.prisma.taskField.update({
      where: { id },
      data: { ...updateFieldDto },
    });
  }

  async remove(id: number, userId: number) {
    const taskField = await this.prisma.taskField.findUnique({
      where: { id },
      include: { project: { select: { userId: true } } },
    });

    if (!taskField || taskField.project.userId !== userId) {
      throw new BadRequestException('Project not found or unauthorized');
    }

    return this.prisma.taskField.delete({
      where: { id },
    });
  }
}
