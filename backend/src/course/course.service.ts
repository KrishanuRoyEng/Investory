import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { CreateModuleDto } from './dto/create-module.dto.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { CourseQueryDto } from './dto/course-query.dto.js';
import { Prisma, CourseStatus } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(dto: CreateCourseDto) {
    const course = await this.prisma.course.create({
      data: dto,
    });
    return { data: course, meta: null };
  }

  async updateCourse(id: string, dto: UpdateCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Slug uniqueness check excluding the course's own ID
    if (dto.slug && dto.slug !== course.slug) {
      const existing = await this.prisma.course.findUnique({ where: { slug: dto.slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('A course with this slug already exists');
      }
    }

    const updated = await this.prisma.course.update({
      where: { id },
      data: dto,
    });
    return { data: updated, meta: null };
  }

  async addModule(courseId: string, dto: CreateModuleDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const courseModule = await this.prisma.courseModule.create({
      data: {
        ...dto,
        courseId,
      },
    });
    return { data: courseModule, meta: null };
  }

  async addLesson(moduleId: string, dto: CreateLessonDto) {
    const courseModule = await this.prisma.courseModule.findUnique({ where: { id: moduleId } });
    if (!courseModule) {
      throw new NotFoundException('Module not found');
    }

    const lesson = await this.prisma.lesson.create({
      data: {
        ...dto,
        moduleId,
      },
    });
    return { data: lesson, meta: null };
  }

  buildCourseWhereClause(query: CourseQueryDto, isPublic: boolean): Prisma.CourseWhereInput {
    const { format, level, language, q, category } = query;
    const where: Prisma.CourseWhereInput = {};

    if (isPublic) {
      where.status = CourseStatus.PUBLISHED;
    }

    if (format) where.format = format;
    if (level) where.level = level;
    if (language) where.language = language;
    if (category) {
      const slugs = category.split(',').map(s => s.trim()).filter(Boolean);
      if (slugs.length > 0) {
        where.category = { slug: { in: slugs } };
      }
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  async findCourses(query: CourseQueryDto, isPublic: boolean) {
    const { page = 1, pageSize = 20 } = query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = this.buildCourseWhereClause(query, isPublic);

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: Math.min(take, 50),
        orderBy: [
          { category: { sortOrder: 'asc' } },
          { createdAt: 'desc' }
        ],
        include: {
          category: {
            select: { slug: true, name: true, sortOrder: true }
          },
          instructor: {
            select: { name: true }
          }
        }
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: {
        page,
        pageSize,
        total,
      },
    };
  }

  async findCourseBySlug(slug: string, isPublic: boolean) {
    const where: Prisma.CourseWhereInput = { slug };
    
    if (isPublic) {
      where.status = CourseStatus.PUBLISHED;
    }

    const course = await this.prisma.course.findFirst({
      where,
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                durationSec: true,
                order: true,
                // Omit videoUrl for public syllabus.
                // Wait, if it's an admin requesting, should they see videoUrl?
                // The requirements say "omit videoUrl to prevent unauthenticated scraping".
                // We'll omit it entirely from this endpoint for simplicity.
                videoUrl: !isPublic, 
              }
            }
          }
        }
      }
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }


    return { data: course, meta: null };
  }

  async getCategories(query: CourseQueryDto) {
    const where = this.buildCourseWhereClause(query, true); // Public gets PUBLISHED only
    
    const categories = await this.prisma.courseCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const result = await Promise.all(
      categories.map(async (cat) => {
        const publishedCount = await this.prisma.course.count({
          where: {
            ...where,
            categoryId: cat.id,
          },
        });
        return {
          slug: cat.slug,
          name: cat.name,
          sortOrder: cat.sortOrder,
          publishedCount,
        };
      })
    );

    return { data: result, meta: null };
  }
}
