import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserController } from './controller/user.controller';
import { User } from '../database/entities/user.entity';
import { UserService } from './service/user.service';
import {RolesGuard} from "../authentication/guards/roles.guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthenticationModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
