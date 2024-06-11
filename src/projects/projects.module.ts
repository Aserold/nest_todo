import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [DatabaseModule],
})
export class ProjectsModule {}
