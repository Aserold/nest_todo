import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({ default: 1 })
  userId: number;

  @ApiProperty({
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({ default: '931b52ba-1ab3-4c66-b41e-112273b937ba' })
  refreshToken: string;
}
