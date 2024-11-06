import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()  // La colonne primaire auto-incrémentée
  _id: number;

  @Column()
  username: string;
}
