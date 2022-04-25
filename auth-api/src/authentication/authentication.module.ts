import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './service/authentication.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '10000s',
        },
      }),
    }),
  ],
  providers: [RolesGuard, JwtAuthGuard, JwtStrategy, AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
