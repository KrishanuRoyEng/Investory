import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { RequirePermission } from "../auth/decorators/permissions.decorator.js";

@Controller("admin/roles")
@UseGuards(PermissionsGuard)
@Roles("STAFF", "ADMIN", "SUPERADMIN")
@RequirePermission("manage_roles")
export class AdminRolesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getRoles() {
    return this.prisma.staffRole.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
  }

  @Post()
  async createRole(@Body() dto: { name: string; permissions: string[] }) {
    return this.prisma.staffRole.create({
      data: {
        name: dto.name,
        permissions: dto.permissions
      }
    });
  }

  @Put(":id")
  async updateRole(@Param("id") id: string, @Body() dto: { name: string; permissions: string[] }) {
    return this.prisma.staffRole.update({
      where: { id },
      data: {
        name: dto.name,
        permissions: dto.permissions
      }
    });
  }

  @Delete(":id")
  async deleteRole(@Param("id") id: string) {
    return this.prisma.staffRole.delete({
      where: { id }
    });
  }
}
