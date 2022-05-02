import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { hasRole } from '../../authentication/decorators/role.decorator';
import { JwtAuthGuard } from '../../authentication/guards/jwt.guard';
import { RolesGuard } from '../../authentication/guards/roles.guard';
import { UserService } from '../service/user.service';
import { User } from '../../database/entities/user.entity';
import { UserDto } from '../models/user.dto';
import { IUser } from '../interface/IUser';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { HttpResponseInterceptor } from '../../interceptors/http-response.interceptor';
import { AuthExceptionInterceptor } from '../../interceptors/auth-exception.interceptor';
import { Role } from '../../authentication/enum/roles.enum';

@Controller('user')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(HttpResponseInterceptor)
@UseInterceptors(AuthExceptionInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() user: User): Promise<UserDto> {
    try {
      const userProfile = await this.userService.create(user);
      // TODO delete userProfile.password;
      return userProfile;
    } catch (e) {
      throw new InternalServerErrorException('Duplicate email or username');
    }
  }

  @Post('login')
  @HttpCode(200)
  // eslint-disable-next-line @typescript-eslint/ban-types
  async login(@Body() user: IUser): Promise<Object> {
    const res = await this.userService.login(user);
    if (res == 'Wrong Credentials') {
      throw new BadRequestException('Wrong Credentials');
    } else return { token: res };
  }

  @hasRole('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findUser(@Param() params): Promise<IUser> {
    const user = await this.userService.find(params.id);
    console.log(user);
    if (!user) {
      throw new NotFoundException('No user with that id');
    } else {
      delete user.password;
      return user;
    }
  }

  @hasRole('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/info')
  getInfo(@Param() params): Promise<IUser> {
    return this.userService.find(params.id).then((res) => {
      delete res.password;
      return res;
    });
  }

  @hasRole('admin')
  @hasRole('user')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    if (await this.userService.deleteOne(id)) {
      return 'successfully deleted user';
    } else {
      throw new NotFoundException('No user with that id');
    }
  }

  @hasRole(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() user: IUser,
  ): Promise<string> {
    if (await this.userService.updateRole(user.role, id)) {
      return `Successfully changed the role to ${user.role}`;
    } else {
      throw new BadRequestException('Wrong Role');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRole('user')
  @hasRole('admin')
  @Put(':id/password')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() passwords,
  ): Promise<string> {
    if (
      await this.userService.updatePassword(
        passwords.password,
        passwords.oldPassword,
        id,
      )
    ) {
      return 'Successfully changed the password';
    } else {
      throw new BadRequestException('password mismatch');
    }
  }

  @hasRole('admin')
  @hasRole('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/userInfo')
  updateInfo(@Param('id') id: string, @Body() user: IUser): Promise<IUser> {
    return this.userService.updateUserInfo(user, id); //TODO put frontend explanation why username might not be changed
  }
}
