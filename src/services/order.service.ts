import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IngredientDto } from 'src/models/ingredient.dto';
import { OrderDto } from 'src/models/order.dto';
import { Ingredient, IngredientDocument } from 'src/schemas/ingredient.schema';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { IngredientService } from './ingredient.service';

@Injectable()
export class OrderService {
  private dish_prepare_topic: string =
    process.env.KAFKA_TOPIC_DISH_PREPARE || 'dish-prepare';

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,
    private readonly ingredientService: IngredientService,
    @Inject('KAFKA_CLIENT')
    private readonly client: ClientKafka,
  ) {}

  public async saveOrder(orderDto: OrderDto) {
    const order = this.mapToOrder(orderDto);
    const orderSave = new this.orderModel(order);
    orderSave.save(this.queryCallback);
  }

  public async prepareDishes() {
    const orders: OrderDocument[] = await this.orderModel
      .find()
      .sort({ orderedAt: 1 });
    const ingredients: Ingredient[] = await this.ingredientModel.find({});
    orders.forEach((order) => {
      const orderIngredients = order.ingredients;
      const enoughIngredient = orderIngredients.every((ingredientInOrder) =>
        ingredients.find(
          (ingredient) =>
            ingredientInOrder.name === ingredient.name &&
            ingredientInOrder.quantity <= ingredient.quantity,
        ),
      );
      if (!enoughIngredient) {
        return;
      }
      console.log(
        `enoughIngredient for order ${order.prefix} ${order.adjective}`,
      );
      orderIngredients.forEach((ingredient) =>
        this.ingredientService.update({
          name: ingredient.name,
          quantity: -ingredient.quantity,
        }),
      );
      this.prepareOrder(order);
    });
  }

  public prepareOrder(order: OrderDocument) {
    this.orderModel.findByIdAndRemove(order._id).then(() => {
      const orderDto: OrderDto = this.mapToOrderDto(order);
      this.client
        .emit(this.dish_prepare_topic, orderDto)
        .subscribe(() =>
          console.log(
            `send dish prepare event ${order.prefix} ${order.adjective}`,
          ),
        );
    });
  }

  private mapToOrder(orderDto: OrderDto): Order {
    return {
      ...orderDto,
      orderId: JSON.stringify(orderDto.id),
    };
  }

  private mapToOrderDto(order: Order): OrderDto {
    const ingredients = order.ingredients.map(this.mapToIngredientDto);
    return {
      id: JSON.parse(order.orderId),
      hash: order.hash,
      prefix: order.prefix,
      adjective: order.adjective,
      icon: order.icon,
      ingredients: ingredients,
    };
  }

  private mapToIngredientDto(ingredient: Ingredient): IngredientDto {
    return {
      name: ingredient.name,
      quantity: ingredient.quantity,
    };
  }

  private queryCallback(err: NativeError, result: any) {
    if (!err) {
      console.log(`order saved`);
    } else {
      console.error(err);
    }
  }
}
