import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [DatabaseModule],
})
export class TasksModule {}
