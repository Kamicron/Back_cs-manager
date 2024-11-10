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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ForbiddenException } from '@nestjs/common';

@Controller('users') // Route de base pour les utilisateurs
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE: Endpoint pour créer un utilisateur (accessible à tous)
  @Post()
  async create(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<User> {
    return this.userService.create(username, password); // Passe les deux arguments
  }

  // READ: Endpoint pour récupérer tous les utilisateurs (requiert une authentification)
  // Route accessible uniquement aux administrateurs
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // READ: Endpoint pour récupérer un utilisateur par ID (requiert une authentification)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<Partial<User>> {
    const currentUser = req.user;
    const user = await this.userService.findOne(id);

    if (currentUser.userId === id || currentUser.isAdmin) {
      return user; // Toutes les données si admin ou propriétaire
    }

    return { username: user.username, level: user.level }; // Données publiques pour les autres
  }

// UPDATE: Endpoint pour mettre à jour un utilisateur (requiert une authentification)
@UseGuards(JwtAuthGuard)
@Put(':id')
async update(
  @Param('id') id: string,
  @Body('username') username: string,
  @Request() req,
): Promise<User> {
  const currentUser = req.user;

  // Vérifie si l'utilisateur est le propriétaire du profil ou un administrateur
  if (currentUser.userId === id || currentUser.isAdmin) {
    return this.userService.update(id, username);
  }

  throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce profil.');
}

  // DELETE: Endpoint pour supprimer un utilisateur (requiert une authentification)
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
