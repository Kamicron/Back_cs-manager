// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { TestModule } from './test/test.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',  // Change cela si nécessaire
      password: 'root',  // Change cela si nécessaire
      database: 'testdb', // Change cela si nécessaire
      entities: [User],  // Assurez-vous que l'entité User est déclarée ici
      synchronize: true,  // Attention à ne pas utiliser "true" en production
    }),
    UserModule,
    TestModule  // Importer UserModule ici
  ],
})
export class AppModule {}
