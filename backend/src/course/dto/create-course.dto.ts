import { IsString, IsNotEmpty, IsInt, Min, IsEnum, Matches, IsOptional } from 'class-validator';
import { CourseFormat, CourseLevel, CourseStatus } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  pricePaise: number;

  @IsEnum(CourseFormat)
  format: CourseFormat;

  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}
