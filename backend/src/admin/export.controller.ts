import { Controller, Get, Query, Res, UseGuards, Param } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { AdminUsersService } from "./admin-users.service.js";
import { AdminPaymentsService } from "./admin-payments.service.js";
import { CourseService } from "../course/course.service.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import type { Response } from "express";
import ExcelJS from "exceljs";
import { OrderStatus } from "@prisma/client";
import { CourseQueryDto } from "../course/dto/course-query.dto.js";

@Controller("admin/export")
@Roles("STAFF", "ADMIN", "SUPERADMIN")
export class AdminExportController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adminUsersService: AdminUsersService,
    private readonly adminPaymentsService: AdminPaymentsService,
    private readonly courseService: CourseService
  ) {}

  @Get("users")
  async exportUsers(@Res() res: Response, @Query("startDate") startDate?: string, @Query("endDate") endDate?: string) {
    const where = this.adminUsersService.buildWhereClause(startDate, endDate);
    const users = await this.prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, staffRole: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");
    worksheet.columns = [
      { header: "User ID", key: "id", width: 36 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Role", key: "role", width: 15 },
      { header: "Active", key: "isActive", width: 10 },
      { header: "Created At", key: "createdAt", width: 25 }
    ];
    worksheet.addRows(users.map(u => ({
      ...u,
      role: u.role === 'STAFF' && (u as any).staffRole?.name ? `STAFF (${(u as any).staffRole.name})` : u.role
    })));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=users_export.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get("courses")
  async exportCourses(@Res() res: Response, @Query() query: CourseQueryDto) {
    const where = this.courseService.buildCourseWhereClause(query, false);
    const courses = await this.prisma.course.findMany({
      where,
      select: { id: true, title: true, status: true, format: true, level: true, pricePaise: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Courses");
    worksheet.columns = [
      { header: "Course ID", key: "id", width: 36 },
      { header: "Title", key: "title", width: 40 },
      { header: "Status", key: "status", width: 15 },
      { header: "Format", key: "format", width: 15 },
      { header: "Level", key: "level", width: 15 },
      { header: "Price (INR)", key: "price", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 }
    ];
    worksheet.getColumn('price').numFmt = '₹#,##0.00';

    worksheet.addRows(courses.map(c => ({
      ...c,
      price: c.pricePaise / 100
    })));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=courses_export.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get("coupons")
  async exportCoupons(@Res() res: Response, @Query("startDate") startDate?: string, @Query("endDate") endDate?: string) {
    const where = this.adminPaymentsService.buildCouponWhereClause(startDate, endDate);
    const coupons = await this.prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Coupons");
    worksheet.columns = [
      { header: "Coupon ID", key: "id", width: 36 },
      { header: "Code", key: "code", width: 20 },
      { header: "Discount Type", key: "discountType", width: 15 },
      { header: "Discount Value", key: "discountVal", width: 15 },
      { header: "Valid Until", key: "validUntil", width: 25 },
      { header: "Usage Limit", key: "usageLimit", width: 15 },
      { header: "Usage Count", key: "usageCount", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 }
    ];
    
    worksheet.addRows(coupons.map(c => {
       const isFlat = c.discountType === 'FLAT';
       return {
         ...c,
         discountVal: isFlat ? c.discountVal / 100 : c.discountVal
       };
    }));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=coupons_export.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get("orders")
  async exportOrders(@Res() res: Response, @Query("status") status?: OrderStatus, @Query("startDate") startDate?: string, @Query("endDate") endDate?: string) {
    const where = this.adminPaymentsService.buildOrderWhereClause(status, startDate, endDate);
    
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=orders_export.xlsx");

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const worksheet = workbook.addWorksheet("Orders");
    worksheet.columns = [
      { header: "Order ID", key: "id", width: 36 },
      { header: "Customer Email", key: "userEmail", width: 30 },
      { header: "Customer Name", key: "userName", width: 25 },
      { header: "Total (INR)", key: "totalInr", width: 15 },
      { header: "Discount (INR)", key: "discountInr", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 }
    ];
    
    worksheet.getColumn('totalInr').numFmt = '₹#,##0.00';
    worksheet.getColumn('discountInr').numFmt = '₹#,##0.00';

    let skip = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const orders = await this.prisma.order.findMany({
        where,
        skip,
        take: batchSize,
        include: { user: { select: { email: true, name: true } } },
        orderBy: { createdAt: 'desc' }
      });

      if (orders.length === 0) {
        hasMore = false;
        break;
      }

      for (const o of orders) {
        worksheet.addRow({
          id: o.id,
          userEmail: o.user.email,
          userName: o.user.name,
          totalInr: o.totalPaise / 100,
          discountInr: o.discountPaise / 100,
          status: o.status,
          createdAt: o.createdAt
        }).commit(); 
      }

      skip += batchSize;
    }

    worksheet.commit();
    await workbook.commit();
  }

  @Get("roles")
  async exportRoles(@Res() res: Response) {
    const roles = await this.prisma.staffRole.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Roles");
    worksheet.columns = [
      { header: "Role ID", key: "id", width: 36 },
      { header: "Name", key: "name", width: 25 },
      { header: "Permissions", key: "permissions", width: 50 },
      { header: "Assigned Users", key: "usersCount", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 }
    ];
    
    worksheet.addRows(roles.map(r => ({
       ...r,
       permissions: r.permissions.join(", "),
       usersCount: r._count.users
    })));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=roles_export.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get("live-sessions")
  async exportLiveSessions(@Res() res: Response, @Query("status") status?: string) {
    const where: any = { type: 'CLASS' };
    if (status) where.status = status;
    const sessions = await this.prisma.liveSession.findMany({
      where,
      include: { instructor: { select: { name: true, email: true } }, _count: { select: { attendances: true } } },
      orderBy: { schedule: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Live Sessions");
    worksheet.columns = [
      { header: "Session ID", key: "id", width: 36 },
      { header: "Title", key: "title", width: 40 },
      { header: "Status", key: "status", width: 15 },
      { header: "Schedule", key: "schedule", width: 25 },
      { header: "Instructor Name", key: "instructorName", width: 25 },
      { header: "Capacity", key: "capacity", width: 15 },
      { header: "Attendees", key: "attendees", width: 15 }
    ];
    
    worksheet.addRows(sessions.map(s => ({
       ...s,
       instructorName: s.instructor.name,
       attendees: s._count.attendances
    })));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=live_sessions_export.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get("webinars")
  async exportWebinars(@Res() res: Response, @Query("status") status?: string) {
    const where: any = { type: 'WEBINAR' };
    if (status) where.status = status;
    const webinars = await this.prisma.liveSession.findMany({
      where,
      include: { instructor: { select: { name: true, email: true } }, _count: { select: { attendances: true } } },
      orderBy: { schedule: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Webinars");
    worksheet.columns = [
      { header: "Webinar ID", key: "id", width: 36 },
      { header: "Title", key: "title", width: 40 },
      { header: "Status", key: "status", width: 15 },
      { header: "Schedule", key: "schedule", width: 25 },
      { header: "Instructor Name", key: "instructorName", width: 25 },
      { header: "Capacity", key: "capacity", width: 15 },
      { header: "Registrations", key: "attendees", width: 15 }
    ];
    
    worksheet.addRows(webinars.map(s => ({
       ...s,
       instructorName: s.instructor.name,
       attendees: s._count.attendances
    })));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=webinars_export.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get("live-sessions/:id/analytics")
  async exportLiveSessionAnalytics(@Res() res: Response, @Param("id") id: string) {
    const attendances = await this.prisma.attendance.findMany({
      where: { liveSessionId: id },
      orderBy: { joinTime: 'asc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Analytics");
    worksheet.columns = [
      { header: "Name", key: "registrationName", width: 25 },
      { header: "Email", key: "registrationEmail", width: 30 },
      { header: "Join Time", key: "joinTime", width: 25 },
      { header: "Leave Time", key: "leaveTime", width: 25 },
      { header: "Retention (Minutes)", key: "retention", width: 20 }
    ];
    
    worksheet.addRows(attendances.map(a => {
       let retention = 0;
       if (a.joinTime && a.leaveTime) {
         retention = Math.round((a.leaveTime.getTime() - a.joinTime.getTime()) / 60000);
       }
       return { ...a, retention };
    }));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=session_${id}_analytics.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get("webinars/:id/analytics")
  async exportWebinarAnalytics(@Res() res: Response, @Param("id") id: string) {
    return this.exportLiveSessionAnalytics(res, id);
  }

  @Get("courses/:id/analytics")
  async exportCourseAnalytics(@Res() res: Response, @Param("id") id: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId: id },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { progressPercent: 'desc' }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Course Analytics");
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Progress (%)", key: "progressPercent", width: 15 },
      { header: "Last Watched Lesson", key: "lastWatchedLesson", width: 36 },
      { header: "Enrolled At", key: "createdAt", width: 25 }
    ];
    
    worksheet.addRows(enrollments.map(e => ({
       ...e,
       name: e.user.name,
       email: e.user.email
    })));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=course_${id}_analytics.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  }
}
