import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('google.clientId') || 'not-configured',
      clientSecret: config.get<string>('google.clientSecret') || 'not-configured',
      callbackURL: config.get<string>('google.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      id: string;
      emails: { value: string }[];
      displayName: string;
      photos: { value: string }[];
    },
    done: VerifyCallback,
  ) {
    const { id, emails, displayName, photos } = profile;
    done(null, {
      providerUserId: id,
      email: emails[0].value,
      name: displayName,
      avatarUrl: photos[0]?.value,
    });
  }
}
