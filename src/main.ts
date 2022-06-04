import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'kitchen',
          brokers: [process.env.KAFKA_HOST || 'localhost:29092'],
        },
        consumer: {
          groupId: 'kitchen-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
