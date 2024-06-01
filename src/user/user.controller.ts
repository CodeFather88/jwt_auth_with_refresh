import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { GetOneUserDto } from './dto/getOneUser.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteUserDto } from './dto/deleteUser.dto';
import { Role } from '@shared/enums';
import { Roles } from '@shared/decorators';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Create user' })
  @Roles(Role.ADMIN)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto)
  }

  @ApiOperation({ summary: 'get one user' })
  @Get(':id')
  async getOneUser(@Param() dto: GetOneUserDto) {
    return await this.userService.findOne(dto.id);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  async deleteUser(@Param() dto: DeleteUserDto) {
    return await this.userService.delete(dto.id)
  }
}
