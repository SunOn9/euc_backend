import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ClubEntity } from 'src/club/entities/club.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PermissionEntity } from '/permission/entities/permission.entity';

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

  @ManyToMany(() => ClubEntity, { cascade: true })
  @JoinTable({
    name: 'user_in_club',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'club_id', referencedColumnName: 'id' },
  })
  club: ClubEntity[];

  @ManyToMany(() => PermissionEntity, { cascade: true })
  @JoinTable({
    name: 'user_with_permission',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permission: PermissionEntity[];

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
