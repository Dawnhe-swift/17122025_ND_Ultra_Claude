import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Director } from '../directors/director.entity';
import { Obligation } from '../obligations/obligation.entity';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  uen: string;

  @Column({ nullable: true })
  sector?: string;

  @ManyToOne(() => Director, (director) => director.companies, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  nomineeDirector?: Director | null;

  @OneToMany(() => Obligation, (obligation) => obligation.company)
  obligations: Obligation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  seedId() {
    this.id = this.id ?? randomUUID();
  }
}

