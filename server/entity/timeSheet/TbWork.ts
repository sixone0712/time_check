import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_work')
export class TbWork {
  @PrimaryGeneratedColumn('increment')
  index: number;
  @Column({ type: 'varchar', length: 20, nullable: false })
  empnum: string; //varchar(20)  not null,
  @Column({ type: 'varchar', length: 20, nullable: false })
  name: string; //varchar(20)  not null,
  @Column({ type: 'varchar', length: 30, nullable: false })
  team: string; //varchar(30)  not null,
  @Column({ type: 'varchar', length: 50, nullable: false })
  department: string; //varchar(50)  not null,
  @Column({ type: 'varchar', length: 50, nullable: false })
  position: string; //varchar(50)  not null,
  @Column({ type: 'varchar', length: 20, nullable: false })
  code: string; //varchar(20)  not null,
  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string; //varchar(50)  not null,
  @Column({ type: 'varchar', length: 100, nullable: false })
  detail: string; //varchar(100) not null,
  @Column({ type: 'varchar', length: 100, nullable: false })
  subdetail: string; //varchar(100) not null,
  @Column({ type: 'varchar', length: 20, nullable: false })
  date: string; //varchar(20)  not null,
  @Column({ type: 'float', nullable: true })
  total: number; //float        null,
  @Column({ type: 'float', nullable: true })
  plan_chk: number; //int          null,
  @Column({ type: 'float', nullable: true })
  plan: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d1: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d2: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d3: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d4: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d5: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d6: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d7: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d8: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d9: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d10: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d11: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d12: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d13: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d14: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d15: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d16: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d17: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d18: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d19: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d20: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d21: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d22: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d23: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d24: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d25: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d26: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d27: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d28: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d29: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d30: number; //float        null,
  @Column({ type: 'float', nullable: true })
  d31: number; //float        null
}
