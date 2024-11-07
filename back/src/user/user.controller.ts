// src/user/user.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')  // Route de base pour les utilisateurs
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE: Endpoint pour créer un utilisateur
  @Post()
  async create(@Body('username') username: string, @Body('password') password: string): Promise<User> {
    return this.userService.create(username, password); // Passe les deux arguments
  }

  // READ: Endpoint pour récupérer tous les utilisateurs
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // READ: Endpoint pour récupérer un utilisateur par ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  // UPDATE: Endpoint pour mettre à jour un utilisateur
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('username') username: string,
  ): Promise<User> {
    return this.userService.update(id, username);
  }

  // DELETE: Endpoint pour supprimer un utilisateur
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
