import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CourseService } from '../course/course.service.js';
import { CreateCourseDto } from '../course/dto/create-course.dto.js';
import { UpdateCourseDto } from '../course/dto/update-course.dto.js';
import { CreateModuleDto } from '../course/dto/create-module.dto.js';
import { CreateLessonDto } from '../course/dto/create-lesson.dto.js';
import { CourseQueryDto } from '../course/dto/course-query.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('admin/courses')
@Roles(Role.ADMIN, Role.INSTRUCTOR)
export class AdminCoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async findCourses(@Query() query: CourseQueryDto) {
    return this.courseService.findCourses(query, false);
  }

  @Post()
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.updateCourse(id, dto);
  }

  @Post(':id/modules')
  async addModule(@Param('id') id: string, @Body() dto: CreateModuleDto) {
    return this.courseService.addModule(id, dto);
  }

  @Post('modules/:moduleId/lessons')
  async addLesson(@Param('moduleId') moduleId: string, @Body() dto: CreateLessonDto) {
    return this.courseService.addLesson(moduleId, dto);
  }
}
