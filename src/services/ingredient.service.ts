import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IngredientDto } from '../models/ingredient.dto';
import { Ingredient, IngredientDocument } from '../schemas/ingredient.schema';

@Injectable()
export class IngredientService {
  constructor(
    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,
  ) {}

  public async update(ingredientDto: IngredientDto) {
    const ingredient = this.mapToIngredient(ingredientDto);
    this.ingredientModel.updateOne(
      { name: ingredient.name },
      { $inc: { quantity: ingredient.quantity } },
      { upsert: true },
      this.queryCallback,
    );
  }

  private mapToIngredient(ingredientDto: IngredientDto): Ingredient {
    return {
      ...ingredientDto,
    };
  }

  private queryCallback(err: NativeError, result: any) {
    if (!err) {
      console.log(`ingredient saved`);
    } else {
      console.error(err);
    }
  }
}
