import { Controller, Post, Body, Req, Headers, UseGuards, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { VerifyPaymentDto } from './dto/verify-payment.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator.js';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(Role.LEARNER)
  @Post('checkout')
  async checkout(@Req() req: Request, @Body() dto: CheckoutDto) {
    const user: any = req.user;
    return this.paymentsService.checkout(user.userId, dto);
  }

  @Roles(Role.LEARNER)
  @Post('verify')
  @HttpCode(200)
  async verifyPayment(@Req() req: Request, @Body() dto: VerifyPaymentDto) {
    const user: any = req.user;
    return this.paymentsService.verifyPayment(user.userId, dto);
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(body, signature);
  }
}
