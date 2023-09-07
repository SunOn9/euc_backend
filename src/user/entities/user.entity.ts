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

@Entity({ name: 'user' })
export class UserEntity {
  static tableName = 'user';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string | null;

  @ManyToMany(() => ClubEntity, { cascade: true })
  @JoinTable({
    name: 'user_in_club',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'club_id', referencedColumnName: 'id' },
  })
  club: ClubEntity[];

  @OneToMany(() => AuthEntity, (auth) => auth.user)
  auth: AuthEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
