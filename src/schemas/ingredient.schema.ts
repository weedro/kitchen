import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IngredientDocument = Ingredient & Document;

@Schema()
export class Ingredient {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  quantity: number;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
