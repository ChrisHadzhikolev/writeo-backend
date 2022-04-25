import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user): Observable<string> {
    return from(
      this.jwtService.signAsync(
        { user },
        { secret: process.env.JWT_SECRET, expiresIn: '1d' },
      ),
    );
  }

  async hashSaltPassword(password: string) {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      return hash;
    });
  }

  comparePasswords(password: string, passwordHash: string): Observable<any> {
    return from(bcrypt.compare(password, passwordHash));
  }
}
