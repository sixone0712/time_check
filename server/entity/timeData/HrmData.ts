import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity('hrm_data')
export class HrmData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userToDate: string;

  @Column()
  date: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @Column({ type: 'float' })
  spentOnHrm: number;

  @Column()
  etc: string;

  @ManyToOne(() => User, (user) => user.hrmData)
  user: User;

  @BeforeInsert()
  private beforeInsert() {
    this.userToDate = `${this.user.id}-${this.date}`;
  }
}
