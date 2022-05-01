import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { HrmData } from './HrmData';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  department: string;

  @Column()
  redmineKey: string;

  @Column()
  redmineId: number;

  @OneToMany(() => HrmData, (hrmData) => hrmData.user)
  hrmData: HrmData[];
}
