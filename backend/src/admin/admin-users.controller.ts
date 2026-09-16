import { Controller, Get, Put, Param, Body, Query } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

@Controller('admin/users')
@Roles(Role.ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const ps = pageSize ? parseInt(pageSize, 10) : 20;
    const data = await this.adminUsersService.findAll(p, ps);
    return { data, meta: { total: data.total, page: data.page, pageSize: data.pageSize } };
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const data = await this.adminUsersService.updateUser(id, dto.name, dto.phone, dto.role);
    return { data, meta: null };
  }
}
