import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('earthquakes')
export class Earthquake {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  magnitude!: number;

  @Column({ type: 'varchar', length: 255 })
  location!: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  depth!: number;

  @Column({ type: 'datetime' })
  date_time!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export interface EarthquakeFilters {
  minMagnitude?: number;
  maxMagnitude?: number;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}