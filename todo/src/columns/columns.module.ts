import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService],
  imports: [DatabaseModule],
})
export class ColumnsModule {}
