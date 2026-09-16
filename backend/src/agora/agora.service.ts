import { Injectable, InternalServerErrorException } from '@nestjs/common';
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } = pkg;

export enum AgoraRole {
  PUBLISHER = 1,
  SUBSCRIBER = 2,
}

@Injectable()
export class AgoraService {
  private readonly appId: string;
  private readonly appCertificate: string;

  constructor() {
    this.appId = process.env.AGORA_APP_ID || 'dummy-app-id';
    this.appCertificate = process.env.AGORA_APP_CERTIFICATE || 'dummy-app-certificate';
  }

  generateTokens(channelName: string, accountId: string, role: AgoraRole, expiryUnixSeconds: number) {
    if (!this.appId || !this.appCertificate) {
      throw new InternalServerErrorException('Agora credentials not configured');
    }

    const rtcRole = role === AgoraRole.PUBLISHER ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Build RTC Token (Video/Audio) using string user IDs (account)
    const rtcToken = RtcTokenBuilder.buildTokenWithAccount(
      this.appId,
      this.appCertificate,
      channelName,
      accountId,
      rtcRole,
      expiryUnixSeconds,
    );

    // Build RTM Token (Chat/Messaging) - RTM does not strictly use channelName for token generation, just userId
    const rtmToken = RtmTokenBuilder.buildToken(
      this.appId,
      this.appCertificate,
      accountId,
      RtmRole.Rtm_User,
      expiryUnixSeconds,
    );

    return { rtcToken, rtmToken };
  }
}
