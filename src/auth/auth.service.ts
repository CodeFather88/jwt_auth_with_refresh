import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@user/user.service';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { Tokens } from './interfaces';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService
    ) { }

    async register(dto: RegisterDto) {
        return await this.userService.create(dto)
    }

    async login(dto: LoginDto, agent: string): Promise<Tokens> {
        const user = await this.userService.findOne(dto.email)
        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return await this.tokenService.generateTokens(user, agent)
    }

}