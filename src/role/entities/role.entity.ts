import { UserEntity } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'role' })
export class RoleEntity {
  static tableName = 'role';

  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToMany(() => UserEntity, (user) => user.role)
  // user: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
