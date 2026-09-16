import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { CreateModuleDto } from './dto/create-module.dto.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { CourseQueryDto } from './dto/course-query.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}



  @Public()
  @Get()
  async findCourses(@Query() query: CourseQueryDto, @Req() req: Request) {
    // If request doesn't have an admin/instructor user, it's public.
    const user: any = req.user;
    const isStaff = user && (user.role === Role.ADMIN || user.role === Role.INSTRUCTOR);
    return this.courseService.findCourses(query, !isStaff);
  }

  @Public()
  @Get(':slug')
  async findCourseBySlug(@Param('slug') slug: string, @Req() req: Request) {
    const user: any = req.user;
    const isStaff = user && (user.role === Role.ADMIN || user.role === Role.INSTRUCTOR);
    return this.courseService.findCourseBySlug(slug, !isStaff);
  }
}
