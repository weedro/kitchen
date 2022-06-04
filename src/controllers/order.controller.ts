import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDto } from 'src/models/order.dto';
import { OrderService } from 'src/services/order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(process.env.KAFKA_TOPIC_ORDER_CREATE || 'order-create')
  async orderCreate(@Payload('value') orderDto: OrderDto) {
    console.log(`received: ${JSON.stringify(orderDto)}`);
    await this.orderService.saveOrder(orderDto);
    await this.orderService.prepareDishes();
  }
}
