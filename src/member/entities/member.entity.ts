import { ClubEntity } from 'src/club/entities/club.entity';
import { EventEntity } from 'src/event/entities/event.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AreaEntity } from '/area/entities/area.entity';
import { EnumMemberStatus } from '/prelude/enums';

@Entity({ name: 'member' })
export class MemberEntity {
  static tableName = 'member';

  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  birthday: Date;

  age: number;

  status: EnumMemberStatus;

  @ManyToOne(() => AreaEntity, (area) => area.member)
  hometown: AreaEntity;

  @ManyToMany(() => ClubEntity, (club) => club.member)
  club: ClubEntity;

  event?: EventEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
