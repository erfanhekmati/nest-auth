import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AtStrategy, RtStrategy } from './strategies';


@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService, 
    AtStrategy, 
    RtStrategy
  ]
})
export class AuthModule {}
