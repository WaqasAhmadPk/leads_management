import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('webhook_log')
export class WebhookLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: 'success' | 'failed';

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'jsonb' })
  payload: any;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
