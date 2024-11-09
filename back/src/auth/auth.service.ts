// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Récupérer l'utilisateur complet avec ses informations (isAdmin, level, etc.)
    const fullUser = await this.userService.findOne(user._id);
    console.log('fullUser', fullUser);

    const payload = {
      username: fullUser.username,
      sub: fullUser._id,
      isAdmin: fullUser.isAdmin, // Assurez-vous que isAdmin et autres champs sont inclus
      level: fullUser.level, // Par exemple, ajoutez le niveau si nécessaire
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
