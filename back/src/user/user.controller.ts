// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserDto } from './user.dto';

@Controller('users') // Route de base pour les utilisateurs
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE: Endpoint pour créer un utilisateur
  @Post()
  async create(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<User> {
    return this.userService.create(username, password);
  }

  // READ: Récupérer tous les utilisateurs
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  // READ: Récupérer un utilisateur par ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Partial<User>> {
    const currentUser = req.user;
    const user = await this.userService.findOne(id);

    if (currentUser.userId === id || currentUser.isAdmin) {
      return user;
    }

    return { username: user.username }; // Données limitées pour les autres
  }

  // UPDATE: Mise à jour utilisateur
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { username?: string; currentPassword?: string; newPassword?: string; confirmPassword?: string },
    @Request() req,
  ): Promise<User> {
    const currentUser = req.user;
  
    if (currentUser.userId !== id && !currentUser.isAdmin) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce profil.');
    }
  
    const { username, currentPassword, newPassword, confirmPassword } = body;
  
    if (!username && !newPassword) {
      throw new BadRequestException('Aucune donnée à mettre à jour.');
    }
  
    if (newPassword) {
      if (!currentPassword) {
        throw new BadRequestException('Le mot de passe actuel est requis pour changer le mot de passe.');
      }
  
      const isPasswordValid = await this.userService.validatePassword(id, currentPassword);
      if (!isPasswordValid) {
        throw new ForbiddenException('Le mot de passe actuel est incorrect.');
      }
  
      if (!confirmPassword || newPassword !== confirmPassword) {
        throw new BadRequestException('Les mots de passe ne correspondent pas.');
      }
    }
  
    const updatedUser = await this.userService.update(id, {
      ...(username && { username }),
      ...(newPassword && { password: newPassword }),
    });
  
    return updatedUser;
  }

  // DELETE: Suppression logique d'un utilisateur
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Request() req): Promise<void> {
    const currentUser = req.user;

    if (currentUser.userId === id || currentUser.isAdmin) {
      return this.userService.softDelete(id);
    }

    throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer ce compte.');
  }
}
