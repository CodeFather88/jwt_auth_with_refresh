import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@user/user.service';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { Tokens } from './interfaces';
import { error } from 'console';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaServise: PrismaService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async register(dto: RegisterDto) {
        return await this.userService.create(dto)
    }

    async login(dto: LoginDto, agent: string): Promise<Tokens> {
        const user = await this.userService.findOne(dto.email)
        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return await this.generateTokens(user, agent)
    }

    private async generateTokens(user: User, agent: string): Promise<Tokens> {
        const accessToken = this.jwtService.sign({ id: user.id, roles: user.roles })
        const refreshToken = await this.getRefreshToken(user.id, agent)
        return { accessToken, refreshToken }
    }

    private async getRefreshToken(userId: string, agent: string): Promise<Token> {
        const token = await this.prismaServise.token.findFirst({ where: { userId, userAgent: agent } })
        return await this.prismaServise.token.upsert({
            where: { token: token ? token.token : '' },
            update: {
                token: v4(),
                exp: add(new Date(), { months: 1 })
            },
            create: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
                userAgent: agent
            }
        })

    }

    async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
        const token = await this.prismaServise.token.delete({ where: { token: refreshToken } })
        if (!token || new Date(token.exp) < new Date()) {
            throw new UnauthorizedException('Refresh token is invalid or expired')
        }
        const user = await this.userService.findOne(token.userId)
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return await this.generateTokens(user, agent)
    }
}