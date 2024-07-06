import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ColumnsService {
  constructor(private prisma: DatabaseService) {}

  async create(createColumnDto: CreateColumnDto, userId: number) {
    const { projectId, name } = createColumnDto;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found or unauthorized');
    }

    const position = await this.prisma.column.count({ where: { projectId } });

    return this.prisma.column.create({
      data: {
        name,
        position,
        projectId,
      },
    });
  }

  async findAll(projectId: number, userId: number) {
    return await this.prisma.column.findMany({
      where: { projectId, project: { userId } },
      orderBy: { position: 'asc' },
      include: { tasks: { orderBy: { position: 'asc' } } },
    });
  }

  async update(id: number, updateColumnDto: UpdateColumnDto, userId: number) {
    return this.prisma.column.update({
      where: { id, project: { userId } },
      data: { ...updateColumnDto },
    });
  }

  async delete(id: number, userId: number) {
    const deletedColumn = await this.prisma.column.findUnique({
      where: { id, project: { userId } },
    });

    if (!deletedColumn) {
      throw new NotFoundException('Column Not Found');
    }

    const allColumns = await this.findAll(deletedColumn.projectId, userId);

    if (!allColumns) {
      return new NotFoundException('Project Not Found');
    }

    allColumns.splice(deletedColumn.position, 1);
    await this.prisma.column.delete({ where: { id } });

    for (let i = 0; i < allColumns.length; i++) {
      await this.prisma.column.update({
        where: { id: allColumns[i].id },
        data: { position: i },
      });
    }
  }

  async move(id: number, newPosition: number, userId: number) {
    const column = await this.prisma.column.findFirst({
      where: { id, project: { userId } },
    });
    if (!column) {
      throw new Error('Column not found or unauthorized');
    }

    const columns = await this.prisma.column.findMany({
      where: { projectId: column.projectId },
      orderBy: { position: 'asc' },
    });

    columns.splice(column.position, 1);
    columns.splice(newPosition, 0, column);

    for (let i = 0; i < columns.length; i++) {
      await this.prisma.column.update({
        where: { id: columns[i].id },
        data: { position: i },
      });
    }

    return this.findAll(column.projectId, userId);
  }
}
