import { AuthEntity } from 'src/auth/entities/auth.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PermissionEntity } from '/permission/entities/permission.entity';
import { EnumUserRole } from '/prelude/enums';
import { EventEntity } from '/event/entities/event.entity';
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity';
import { ClubEntity } from '/club/entities/club.entity';
import { LogEntity } from '/log/entities/log.entity';

@Entity({ name: 'user' })
export class UserEntity {
  static tableName = 'user';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true, nullable: true })
  phone?: string | null;

  @Column()
  role: EnumUserRole;

  @ManyToMany(() => PermissionEntity, { cascade: true })
  @JoinTable({
    name: 'user_with_permission',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permission: PermissionEntity[];

  @OneToMany(() => LogEntity, (log) => log.user)
  log: LogEntity[];

  @ManyToOne(() => ClubEntity, (club) => club.user)
  club: ClubEntity;

  @OneToMany(
    () => ReceiptSessionEntity,
    (receiptSession) => receiptSession.userConfirm,
  )
  receiptSessionConfirm: ReceiptSessionEntity[];

  @OneToMany(
    () => ReceiptSessionEntity,
    (receiptSession) => receiptSession.userDone,
  )
  receiptSessionDone: ReceiptSessionEntity[];

  @OneToMany(() => AuthEntity, (auth) => auth.user)
  auth: AuthEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
