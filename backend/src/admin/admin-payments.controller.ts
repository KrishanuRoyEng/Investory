import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { AdminPaymentsService } from './admin-payments.service.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role, DiscountType } from '@prisma/client';
import { IsString, IsEnum, IsInt, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsInt()
  @Min(1)
  discountVal: number;

  @IsDateString()
  validUntil: string;

  @IsInt()
  @IsOptional()
  usageLimit?: number;
}

@Controller('admin')
@Roles(Role.ADMIN)
export class AdminPaymentsController {
  constructor(private readonly adminPaymentsService: AdminPaymentsService) {}

  @Get('orders')
  async findAllOrders(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const ps = pageSize ? parseInt(pageSize, 10) : 20;
    const data = await this.adminPaymentsService.findAllOrders(p, ps);
    return { data, meta: { total: data.total, page: data.page, pageSize: data.pageSize } };
  }

  @Post('orders/:id/refund')
  async refundOrder(@Param('id') id: string) {
    const data = await this.adminPaymentsService.refundOrder(id);
    return { data, meta: null };
  }

  @Get('coupons')
  async findAllCoupons(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const ps = pageSize ? parseInt(pageSize, 10) : 20;
    const data = await this.adminPaymentsService.findAllCoupons(p, ps);
    return { data, meta: { total: data.total, page: data.page, pageSize: data.pageSize } };
  }

  @Post('coupons')
  async createCoupon(@Body() dto: CreateCouponDto) {
    const data = await this.adminPaymentsService.createCoupon(
      dto.code,
      dto.discountType,
      dto.discountVal,
      new Date(dto.validUntil),
      dto.usageLimit
    );
    return { data, meta: null };
  }
}
