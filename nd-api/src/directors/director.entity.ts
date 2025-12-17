import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Obligation } from '../obligations/obligation.entity';

@Entity({ name: 'directors' })
export class Director {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => Company, (company) => company.nomineeDirector)
  companies: Company[];

  @OneToMany(() => Obligation, (obligation) => obligation.director)
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

