import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from '../../guards/at.strategy';
import { RolesGuard } from '../../guards/roles.guard';
import { RefreshTokenStrategy } from '../../guards/rt.strategy';
import { AuthToolsService } from '../../helpers/auth-helper';
import { UserModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RolesGuard,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthToolsService,
  ],
  exports: [
    AuthService,
    AuthToolsService,
    PassportModule,
    JwtModule,
    RolesGuard,
  ],
})
export class AuthModule { }
