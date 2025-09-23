import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: ['admin', 'moderator', 'user'], default: 'user' })
  role!: 'admin' | 'moderator' | 'user';

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  emailVerified!: boolean;

  // Refresh token storage
  @Column({ type: 'text', nullable: true })
  refreshToken?: string;

  // Password reset
  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'datetime', nullable: true })
  resetPasswordExpires?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
