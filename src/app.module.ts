import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { options } from '@auth/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from '@auth/guards/auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'

@Module({
  imports: [UserModule, PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), JwtModule.registerAsync(options())],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }