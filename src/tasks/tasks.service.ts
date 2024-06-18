import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {
  constructor(private prisma: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const { name, description, columnId } = createTaskDto;

    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { project: true },
    });

    if (column.project.userId !== userId) {
      throw new UnauthorizedException('The column does not belong to the user');
    }

    const position = await this.prisma.task.count({
      where: { columnId },
    });

    return this.prisma.task.create({
      data: {
        name,
        description,
        position,
        columnId,
      },
    });
  }

  async findAll(columnId: number, userId: number) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { project: true },
    });

    if (column.project.userId !== userId) {
      throw new UnauthorizedException('The column does not belong to the user');
    }

    return this.prisma.task.findMany({
      where: { columnId },
      orderBy: { position: 'asc' },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { column: { include: { project: true } } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.column.project.userId !== userId) {
      throw new UnauthorizedException('The task does not belong to the user');
    }

    const data = { ...updateTaskDto };

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { column: { include: { project: true } } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.column.project.userId !== userId) {
      throw new UnauthorizedException('The task does not belong to the user');
    }

    const tasks = await this.prisma.task.findMany({
      where: { columnId: task.columnId },
      orderBy: { position: 'asc' },
    });
    tasks.splice(task.position, 1);
    await this.prisma.task.delete({ where: { id } });

    for (let i = 0; i < tasks.length; i++) {
      await this.prisma.task.update({
        where: { id: tasks[i].id },
        data: { position: i },
      });
    }
  }

  async move(
    id: number,
    newPosition: number,
    newColumnId: number,
    userId: number,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { column: { include: { project: true } } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.column.project.userId !== userId) {
      throw new UnauthorizedException('The task does not belong to the user');
    }

    const tasks = await this.prisma.task.findMany({
      where: { columnId: task.columnId },
      orderBy: { position: 'asc' },
    });

    tasks.splice(task.position, 1);

    if (newColumnId !== task.columnId) {
      task.columnId = newColumnId;
      const newColumnTasks = await this.prisma.task.findMany({
        where: { columnId: newColumnId },
        orderBy: { position: 'asc' },
      });
      newColumnTasks.splice(newPosition, 0, task);
      for (let i = 0; i < newColumnTasks.length; i++) {
        if (i === newPosition) {
          await this.prisma.task.update({
            where: { id },
            data: { columnId: newColumnId, position: i },
          });
        } else {
          await this.prisma.task.update({
            where: { id: newColumnTasks[i].id },
            data: { position: i },
          });
        }
      }
      for (let i = 0; i < tasks.length; i++) {
        await this.prisma.task.update({
          where: { id: tasks[i].id },
          data: { position: i },
        });
      }
    } else {
      tasks.splice(newPosition, 0, task);
      for (let i = 0; i < tasks.length; i++) {
        await this.prisma.task.update({
          where: { id: tasks[i].id },
          data: { position: i },
        });
      }
    }

    return { message: 'Task moved successfully' };
  }
}
