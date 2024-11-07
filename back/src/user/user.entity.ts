import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')  // Utilisation d'UUID pour l'ID
  _id: string;

  @Column()
  username: string;

  @Column()
  password: string;  // On va hasher ce champ plus tard
}
