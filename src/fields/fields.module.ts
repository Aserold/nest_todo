import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [FieldsController],
  providers: [FieldsService],
  imports: [DatabaseModule],
})
export class FieldsModule {}
