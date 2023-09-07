import { AreaEntity } from 'src/area/entities/area.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'club' })
export class ClubEntity {
  static tableName = 'club';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.club)
  user: UserEntity[];

  @ManyToOne(() => AreaEntity, (area) => area.club)
  @JoinColumn({ name: 'area_id' })
  area: AreaEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(partial: Partial<ClubEntity>) {
    Object.assign(this, partial);
  }
}
