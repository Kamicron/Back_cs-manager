import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // Ajout d'un booléen pour l'admin
  @Column({ default: false })
  isAdmin: boolean;

  // Propriété "level" qui sera publique
  @Column({ default: 1 })
  level: number;
}
