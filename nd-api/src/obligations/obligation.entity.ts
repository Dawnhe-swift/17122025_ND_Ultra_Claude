import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Director } from '../directors/director.entity';

export enum ObligationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

@Entity({ name: 'obligations' })
export class Obligation {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'enum', enum: ObligationStatus, default: ObligationStatus.PENDING })
  status: ObligationStatus;

  @ManyToOne(() => Company, (company) => company.obligations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  company: Company;

  @ManyToOne(() => Director, (director) => director.obligations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  director?: Director | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  seedId() {
    this.id = this.id ?? randomUUID();
  }
}

