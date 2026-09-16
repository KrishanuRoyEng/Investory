import { IsArray, IsString, IsOptional, ArrayNotEmpty } from 'class-validator';

export class CheckoutDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  courseIds: string[];

  @IsOptional()
  @IsString()
  couponCode?: string;
}
