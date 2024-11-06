// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // CREATE: Ajouter un nouvel utilisateur
  async create(username: string): Promise<User> {
    const newUser = this.userRepository.create({ username });
    return this.userRepository.save(newUser);
  }

  // READ: Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // READ: Récupérer un utilisateur par son _id
  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ _id: id });
  }

  // UPDATE: Mettre à jour un utilisateur
  async update(id: number, username: string): Promise<User> {
    await this.userRepository.update(id, { username });
    return this.findOne(id); // Renvoyer l'utilisateur mis à jour
  }

  // DELETE: Supprimer un utilisateur
  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
