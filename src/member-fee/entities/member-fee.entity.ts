import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberEntity } from '/member/entities/member.entity';
import { GuestEntity } from '/guest/entities/guest.entity';

@Entity({ name: 'member_fee' })
export class MemberFeeEntity {
  static tableName = 'member_fee';

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  monthly?: string | null;

  @OneToOne(() => MemberEntity, (member) => member.fee, {
    nullable: true,
  })
  member?: MemberEntity | null;

  @OneToOne(() => GuestEntity, (guest) => guest.fee, {
    nullable: true,
  })
  guest?: GuestEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
