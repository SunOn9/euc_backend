import { ClubEntity } from 'src/club/entities/club.entity';
import { EventEntity } from 'src/event/entities/event.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'member' })
export class MemberEntity {
  static tableName = 'member';

  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  birthday: Date;

  age: number;

  club: ClubEntity;

  event?: EventEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
