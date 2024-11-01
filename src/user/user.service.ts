import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'
import { genSalt, hash } from 'bcrypt'
import { CreateUserDto } from './dto/createUser.dto'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(user: CreateUserDto) {
    const hashedPassword = await this.hashPassword(user.password)
    const newUser = await this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: ['USER'],
      },
      select: {
        id: true,
        email: true,
        roles: true
      }
    })
    return { status: 'ok', newUser }
  }

  async delete(id: string) {
    await this.prismaService.user.delete({ where: { id } })
    return { status: 'ok' }
  }

  async list({ take, skip }) {
    const list = await this.prismaService.user.findMany({
      take,
      skip
    })
    return { list };
  }

  async get(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id
      },
      select: {
        email: true,
        id: true,
        roles: true,
      }
    })
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10)
    return await hash(password, salt)
  }
}
