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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // READ: Endpoint pour récupérer un utilisateur par ID (requiert une authentification)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  // UPDATE: Endpoint pour mettre à jour un utilisateur (requiert une authentification)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('username') username: string,
  ): Promise<User> {
    return this.userService.update(id, username);
  }

  // DELETE: Endpoint pour supprimer un utilisateur (requiert une authentification)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
