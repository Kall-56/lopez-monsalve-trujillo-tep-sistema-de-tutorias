import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('logs')
@Index(['timestamp', 'method', 'endpoint'])
@Index(['userId', 'timestamp'])
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  method: string;

  @Column({ type: 'varchar', length: 500 })
  endpoint: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  userRole?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent?: string;

  @Column({ type: 'jsonb', nullable: true })
  requestBody?: any;

  @Column({ type: 'jsonb', nullable: true })
  responseBody?: any;

  @Column({ type: 'int', default: 0 })
  statusCode: number;

  @Column({ type: 'int', default: 0 })
  responseTime: number; // en milisegundos

  @Column({ type: 'varchar', length: 100, nullable: true })
  errorMessage?: string;

  @Column({ type: 'varchar', length: 20, default: 'INFO' })
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

  @CreateDateColumn()
  timestamp: Date;
} 