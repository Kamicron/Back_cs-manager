// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // CREATE: Ajouter un nouvel utilisateur
  async create(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);  // Hachage du mot de passe
    const newUser = this.userRepository.create({ username, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  // READ: Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { deleted_at: null } });
  }

  // READ: Récupérer un utilisateur par son _id
  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { _id: id, deleted_at: null } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  // UPDATE: Mettre à jour un utilisateur
  async update(id: string, username: string): Promise<User> {
    await this.userRepository.update(id, { username });
    return this.findOne(id); // Renvoyer l'utilisateur mis à jour
  }

  // DELETE: Supprimer un utilisateur
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateUserLastLogin(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async softDelete(userId: string): Promise<void> {
    await this.userRepository.update(userId, { deleted_at: new Date() });
  }
}
