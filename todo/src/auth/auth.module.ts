import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RmqClientModule } from 'src/rmq-client/rmq-client.module';

@Module({
  providers: [],
  controllers: [AuthController],
  imports: [RmqClientModule],
})
export class AuthModule {}
