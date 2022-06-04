import { IngredientDto } from './ingredient.dto';

export class OrderDto {
  id: any;
  hash: string;
  prefix: string;
  adjective: string;
  icon: number;
  ingredients: IngredientDto[];
}
