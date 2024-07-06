import { ApiProperty } from '@nestjs/swagger';
import { FindallColumns } from 'src/columns/swagger_types/findall-type';

export class FindallProjects {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  userId: number;
  @ApiProperty({ type: [FindallColumns] })
  columns: FindallColumns[];
}
