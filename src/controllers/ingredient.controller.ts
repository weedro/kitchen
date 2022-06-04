import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IngredientService } from '../services/ingredient.service';
import { IngredientDto } from '../models/ingredient.dto';
import { OrderService } from 'src/services/order.service';

@Controller()
export class IngredientController {
  constructor(
    private readonly ingredientService: IngredientService,
    private readonly orderService: OrderService,
  ) {}

  @MessagePattern(
    process.env.KAFKA_TOPIC_INGREDIENT_GENERATE || 'ingredient-generate',
  )
  async ingredientGenerate(@Payload('value') ingredientDto: IngredientDto) {
    console.log(`received: ${JSON.stringify(ingredientDto)}`);
    await this.ingredientService.update(ingredientDto);
    await this.orderService.prepareDishes();
  }
}
