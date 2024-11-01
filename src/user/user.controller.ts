import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Role } from '@shared/enums';
import { CurrentUser, Roles } from '@shared/decorators';
import { ListDto } from './dto/list.dto';
import { User } from '@prisma/client';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiProperty()
  @Post()
  @Roles(Role.ADMIN)
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @ApiProperty()
  @Get('list')
  async list(@Query() query: ListDto) {
    return this.userService.list(query);
  }

  @ApiProperty()
  @Get('me')
  async me(@CurrentUser() user: User) {
    return this.userService.get(user.id);
  }
}
