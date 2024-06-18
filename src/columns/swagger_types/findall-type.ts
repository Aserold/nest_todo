import { ApiProperty } from '@nestjs/swagger';
import { FindallTasks } from 'src/tasks/swagger_types/findall-type';

export class FindallColumns {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty({ type: [FindallTasks] })
  tasks: FindallTasks[];
}
