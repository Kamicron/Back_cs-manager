// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';  // Assurez-vous que l'entité User est importée
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Importer l'entité User ici pour UserRepository
  providers: [UserService],  // Fournir UserService
  controllers: [UserController],  // Fournir UserController
  exports: [UserService],  // Exporter UserService pour être utilisé dans d'autres modules (comme AuthModule)
})
export class UserModule {}
