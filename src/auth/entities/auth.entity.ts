import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LogEntity } from '/log/entities/log.entity';

@Entity({ name: 'auth' })
export class AuthEntity {
  static tableName = 'auth';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.auth)
  user: UserEntity;

  @Column({ nullable: true })
  ipAddress?: string | null;

  @Column({ nullable: true })
  authToken?: string | null;

  @Column({ nullable: true })
  sessionId?: string | null;

  @Column({ nullable: true })
  userAgent?: string | null;

  @Column({ nullable: true })
  platform?: string | null;

  @Column({ nullable: true })
  longtitude?: number | null;

  @Column({ nullable: true })
  latitude?: number | null;

  @OneToMany(() => LogEntity, (log) => log.auth)
  log: LogEntity[];

  @CreateDateColumn()
  createdAt: number;

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}
