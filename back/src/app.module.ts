// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { config } from 'dotenv';
import { ProtectedController } from './protected/protected.controller';
config();

console.log("process.env.DB_USERNAME",process.env.DB_USERNAME)

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,      // Utilisation de la variable d'environnement
      port: parseInt(process.env.DB_PORT),  // Conversion en entier
      username: process.env.DB_USERNAME,   // Utilisation de la variable d'environnement
      password: process.env.DB_PASSWORD,   // Utilisation de la variable d'environnement
      database: process.env.DB_DATABASE,  
      entities: [User],  // Assurez-vous que l'entité User est déclarée ici
      synchronize: true,  // Attention à ne pas utiliser "true" en production
    }),
    UserModule,
    TestModule,
    AuthModule  
  ],
  controllers: [ProtectedController],
})
export class AppModule {}
