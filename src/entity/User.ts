import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ name: 'email', length: 70 })
  email: string;

  @Column({ name: 'password', length: 255, select: false })
  password: string;

  @Column({ default: 0, name: 'token_version', select: false })
  tokenVersion: number;
}
