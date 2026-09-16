import { IsString, IsNotEmpty, IsInt, Min, IsUrl, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSec?: number;

  @IsInt()
  @Min(0)
  order: number;
}
