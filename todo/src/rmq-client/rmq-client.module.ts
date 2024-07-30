import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbit:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'FIELD_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbit:5672'],
          queue: 'field_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbit:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'FIELD_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbit:5672'],
          queue: 'field_queue',
          queueOptions: { durable: false },
          serializer: {
            serialize(value: any) {
              return {
                contentType: 'application/json',
                content: Buffer.from(JSON.stringify(value)),
              };
            },
          },
        },
      },
    ]),
  ],
})
export class RmqClientModule {}
