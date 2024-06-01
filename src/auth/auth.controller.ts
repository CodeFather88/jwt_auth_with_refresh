import { Controller, Post, Body, Get, Res, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { Cookie, Public, UserAgent } from '@shared/decorators';
import { LoginDto, RegisterDto } from './dto';
import { Role } from '@shared/enums';
import { TokenService } from 'src/token/token.service';

const REFRESH_TOKEN = 'refreshtoken'
@ApiTags('Authorization')
@Public()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService, private readonly tokenService: TokenService) { }

    @ApiOperation({ summary: 'login' })
    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
        console.log(agent)
        const tokens = await this.authService.login(dto, agent)
        if (!tokens) {
            return null
        }
        await this.setRefreshTokenToCookies(tokens, res)
        res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken })
    }

    @ApiOperation({ summary: 'register' })
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return await this.authService.register(dto)
    }

    @ApiOperation({ summary: 'refresh-tokens' })
    @Get('refresh-tokens')
    async refreshTokens(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }
        const tokens = await this.tokenService.refreshTokens(refreshToken, agent);
        if (!tokens) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        await this.setRefreshTokenToCookies(tokens, res);
        res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken });
    }


    private async setRefreshTokenToCookies(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException()
        }
        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/'
        })
    }
}