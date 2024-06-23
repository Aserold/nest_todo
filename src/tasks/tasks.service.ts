import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto, FieldValueDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { FieldType } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: DatabaseService) {}

  async validateFieldValues(
    fieldValues: FieldValueDto[],
    taskFields: {
      id: number;
      projectId: number;
      name: string;
      fieldType: FieldType;
    }[],
  ) {
    if (!fieldValues || fieldValues.length !== taskFields.length) {
      throw new BadRequestException(
        'Invalid amount of field types. Make sure all field types of your project are provided.',
      );
    }
    fieldValues.sort((a, b) => a.fieldId - b.fieldId);

    for (let i = 0; i < fieldValues.length; i++) {
      const { fieldId, stringValue, numberValue } = fieldValues[i];
      if (fieldId !== taskFields[i].id) {
        throw new BadRequestException(
          `Field with id - ${fieldId} is not found in the project.`,
        );
      }

      if (
        taskFields[i].fieldType === 'STRING' &&
        typeof stringValue !== 'string'
      ) {
        throw new BadRequestException(
          `Field with id - ${fieldId} expects a string value.`,
        );
      }
      if (
        taskFields[i].fieldType === 'NUMBER' &&
        typeof numberValue !== 'number'
      ) {
        throw new BadRequestException(
          `Field with id - ${fieldId} expects a number value.`,
        );
      }
      // TODO: add option validation
    }
  }

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const { name, description, columnId, fieldValues } = createTaskDto;

    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      select: { project: { select: { id: true, userId: true } } },
    });

    if (column.project.userId !== userId) {
      throw new UnauthorizedException('The column does not belong to the user');
    }

    const position = await this.prisma.task.count({
      where: { columnId },
    });

    const taskFields = await this.prisma.taskField.findMany({
      where: { projectId: column.project.id },
      orderBy: { id: 'asc' },
    });

    if (taskFields.length !== 0) {
      this.validateFieldValues(fieldValues, taskFields);
    }

    const task = await this.prisma.task.create({
      data: {
        name,
        description,
        position,
        columnId,
      },
    });

    if (fieldValues) {
      for (const fieldValue of fieldValues) {
        const { fieldId, stringValue, numberValue } = fieldValue;
        await this.prisma.taskFieldValue.create({
          data: {
            taskId: task.id,
            fieldId,
            stringValue,
            numberValue,
          },
        });
      }
    }

    return this.prisma.task.findUnique({
      where: { id: task.id },
      include: {
        fieldValues: {
          select: { fieldId: true, stringValue: true, numberValue: true },
          orderBy: { fieldId: 'asc' },
        },
      },
    });
  }

  async findAll(columnId: number, userId: number) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      select: { project: { select: { userId: true } } },
    });

    if (column.project.userId !== userId) {
      throw new UnauthorizedException('The column does not belong to the user');
    }

    return this.prisma.task.findMany({
      where: { columnId },
      include: {
        fieldValues: {
          select: { fieldId: true, stringValue: true, numberValue: true },
          orderBy: { fieldId: 'asc' },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const { name, description, fieldValues } = updateTaskDto;

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        column: { select: { project: { select: { id: true, userId: true } } } },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.column.project.userId !== userId) {
      throw new UnauthorizedException('The task does not belong to the user');
    }

    const taskFields = await this.prisma.taskField.findMany({
      where: { projectId: task.column.project.id },
      orderBy: { id: 'asc' },
    });

    if (taskFields.length !== 0) {
      this.validateFieldValues(fieldValues, taskFields);
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    if (fieldValues) {
      for (const fieldValue of fieldValues) {
        const { fieldId, stringValue, numberValue } = fieldValue;
        await this.prisma.taskFieldValue.upsert({
          where: {
            taskId_fieldId: {
              taskId: id,
              fieldId,
            },
          },
          update: {
            stringValue,
            numberValue,
          },
          create: {
            taskId: id,
            fieldId,
            stringValue,
            numberValue,
          },
        });
      }
    }

    return this.prisma.task.findUnique({
      where: { id: updatedTask.id },
      include: {
        fieldValues: {
          select: { fieldId: true, stringValue: true, numberValue: true },
          orderBy: { fieldId: 'asc' },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        column: { select: { project: { select: { userId: true } } } },
      },
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
      include: {
        column: { select: { project: { select: { userId: true } } } },
      },
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
