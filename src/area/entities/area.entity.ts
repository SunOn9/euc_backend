import { ClubEntity } from 'src/club/entities/club.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberEntity } from '/member/entities/member.entity';

@Entity({ name: 'area' })
export class AreaEntity {
  static tableName = 'area';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ClubEntity, (club) => club.area)
  club: ClubEntity[];

  @OneToMany(() => MemberEntity, (member) => member.hometown)
  member: MemberEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  constructor(partial: Partial<AreaEntity>) {
    Object.assign(this, partial);
  }
}
