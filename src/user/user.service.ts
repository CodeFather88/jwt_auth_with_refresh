import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'
import { genSalt, hash } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(user: Partial<User>) {
    const hashedPassword = await this.hashPassword(user.password)
    const newUser = await this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: ['USER'],
      },
    })
    return { status: 'ok', newUser }
  }

  async findOne(idOrEmail: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { id: idOrEmail },
          { email: idOrEmail }
        ],
      },
    });
    return user;
  }

  async delete(id: string) {
    await this.prismaService.user.delete({ where: { id } })
    return { status: 'ok' }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10)
    return await hash(password, salt)
  }
}
