import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto, FieldValueDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';
import { FieldType } from '@prisma/client';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TasksService {
  constructor(
    private prisma: DatabaseService,
    @Inject('FIELD_SERVICE') private client: ClientProxy,
  ) {}

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

    if (!column) {
      throw new BadRequestException('Column not found');
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
      const valuesData = {
        fieldValues: [],
      };

      for (const fieldValue of fieldValues) {
        const payload = {
          fieldValue: {
            ...fieldValue,
            taskId: task.id,
          },
        };

        const record = new RmqRecordBuilder(payload)
          .setOptions({
            type: 'create-values',
            contentType: 'application/json',
          })
          .build();

        const rpcResult = await firstValueFrom(
          this.client.send('create-values', record),
        );
        if (rpcResult['error']) {
          throw new InternalServerErrorException();
        }

        valuesData.fieldValues.push(rpcResult);
      }

      return { ...task, fieldValues: valuesData.fieldValues };
    }

    return task;
  }

  async findAll(columnId: number, userId: number) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      select: { project: { select: { userId: true } } },
    });

    if (!column) {
      throw new BadRequestException('Column not found');
    }

    if (column.project.userId !== userId) {
      throw new UnauthorizedException('The column does not belong to the user');
    }

    const tasks = await this.prisma.task.findMany({
      where: { columnId },
      orderBy: { position: 'asc' },
    });

    if (!tasks.length) {
      return tasks.map((task) => ({
        ...task,
        fieldValues: [],
      }));
    }

    const taskIds = tasks.map((task) => task.id);

    const payload = {
      taskIds: taskIds,
    };

    const record = new RmqRecordBuilder(payload)
      .setOptions({
        type: 'findall-values',
        contentType: 'application/json',
      })
      .build();

    const fieldValues = await firstValueFrom(
      this.client.send('findall-values', record),
    );

    if (fieldValues['error']) {
      throw new InternalServerErrorException();
    }

    const tasksWithFieldValues = tasks.map((task) => ({
      ...task,
      fieldValues:
        fieldValues['fieldValues'].filter(
          (value) => value.taskId === task.id,
        ) || [],
    }));

    return tasksWithFieldValues;
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
      const valuesData = {
        fieldValues: [],
      };

      for (const fieldValue of fieldValues) {
        const payload = {
          fieldValue: {
            ...fieldValue,
            taskId: task.id,
          },
        };

        const record = new RmqRecordBuilder(payload)
          .setOptions({
            type: 'update-values',
            contentType: 'application/json',
          })
          .build();

        const rpcResult = await firstValueFrom(
          this.client.send('update_values', record),
        );
        if (rpcResult['error']) {
          throw new InternalServerErrorException();
        }

        valuesData.fieldValues.push(rpcResult);
      }

      return { ...updatedTask, ...valuesData };
    }

    return updatedTask;
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
