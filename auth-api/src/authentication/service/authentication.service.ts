import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user): Promise<string> {
    return this.jwtService.signAsync(
      { user },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' },
    );
  }

  async hashSaltPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  comparePasswords(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
