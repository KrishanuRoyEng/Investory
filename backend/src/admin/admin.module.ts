import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller.js';
import { AdminCoursesController } from './admin-courses.controller.js';
import { AdminPaymentsController } from './admin-payments.controller.js';
import { AdminSchedulesController } from './admin-schedules.controller.js';
import { AdminUsersService } from './admin-users.service.js';
import { AdminPaymentsService } from './admin-payments.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CourseModule } from '../course/course.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { LiveSessionsModule } from '../live-sessions/live-sessions.module.js';
import { WebinarsModule } from '../webinars/webinars.module.js';

@Module({
  imports: [PrismaModule, CourseModule, PaymentsModule, LiveSessionsModule, WebinarsModule],
  controllers: [
    AdminUsersController,
    AdminCoursesController,
    AdminPaymentsController,
    AdminSchedulesController,
  ],
  providers: [AdminUsersService, AdminPaymentsService],
})
export class AdminModule {}
