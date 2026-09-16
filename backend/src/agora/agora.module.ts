import { Module } from '@nestjs/common';
import { AgoraService } from './agora.service.js';

@Module({
  providers: [AgoraService],
  exports: [AgoraService],
})
export class AgoraModule {}
