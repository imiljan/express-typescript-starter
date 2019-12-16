import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;
}
