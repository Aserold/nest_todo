import { ApiProperty } from '@nestjs/swagger';
import { FindallColumns } from 'src/columns/swagger_types/findall-type';

export class FindoneProject {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string | null;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  userId: number;
  @ApiProperty({ type: [FindallColumns] })
  columns: FindallColumns[];
}
