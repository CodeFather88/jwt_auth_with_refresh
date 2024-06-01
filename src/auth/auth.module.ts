import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { options } from './config';
import { GUARDS } from './guards';
import { TokenModule } from 'src/token/token.module';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
    ],
    imports: [PassportModule, UserModule, TokenModule]
})
export class AuthModule { }
