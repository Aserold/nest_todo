import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RmqClientModule } from 'src/rmq-client/rmq-client.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [DatabaseModule, RmqClientModule],
})
export class TasksModule {}
