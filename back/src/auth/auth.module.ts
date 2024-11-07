import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module'; 
import { config } from 'dotenv';
import { AuthController } from './auth.controller';
config();

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,  
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService,],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
