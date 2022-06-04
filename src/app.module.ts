import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientController } from './controllers/ingredient.controller';
import { IngredientService } from './services/ingredient.service';
import { Ingredient, IngredientSchema } from './schemas/ingredient.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:27017',
    ),
    MongooseModule.forFeature([
      { name: Ingredient.name, schema: IngredientSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_HOST || 'localhost:29092'],
          },
        },
      },
    ]),
  ],
  controllers: [IngredientController, OrderController],
  providers: [IngredientService, OrderService],
})
export class AppModule {}
