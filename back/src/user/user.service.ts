// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ username, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  // READ: Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { deleted_at: null } });
  }

  // READ: Récupérer un utilisateur par son _id
  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { _id: id, deleted_at: null } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }

  // READ: Récupérer un utilisateur par son nom d'utilisateur
  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  // VALIDATION: Valider un mot de passe actuel
  async validatePassword(userId: string, password: string): Promise<boolean> {
    const user = await this.findOne(userId);
    return bcrypt.compare(password, user.password);
  }

  // UPDATE: Mettre à jour un utilisateur (supporte plusieurs champs)
  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  // DELETE: Suppression logique d'un utilisateur
  async softDelete(userId: string): Promise<void> {
    await this.userRepository.update(userId, { deleted_at: new Date() });
  }
}
