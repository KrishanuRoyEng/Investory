import { IsString, IsNotEmpty, IsInt, Min, IsEnum, Matches, IsOptional, IsArray } from 'class-validator';
import { CourseFormat, CourseLevel, CourseStatus, BannerTag } from '@prisma/client';

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

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsEnum(BannerTag)
  bannerTag?: BannerTag;

  @IsOptional()
  @IsString()
  instructorId?: string;

  @IsOptional()
  @IsString()
  instructorName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  compareAtPricePaise?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayLearnerCount?: number;

  @IsOptional()
  @IsString()
  brochureUrl?: string;

  @IsOptional()
  @IsString()
  cutoutImageUrl?: string;
}
