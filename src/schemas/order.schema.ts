import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  Ingredient,
  IngredientSchema,
} from './ingredient.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  orderId: string;
  @Prop({ required: true })
  hash: string;
  @Prop({ required: true })
  prefix: string;
  @Prop({ required: true })
  adjective: string;
  @Prop({ required: true })
  icon: number;
  @Prop({ type: [IngredientSchema], required: true })
  ingredients: Ingredient[];
  @Prop({ default: () => Date.now() })
  orderedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
