import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// models/permission.model.ts
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string; // 'read:earthquakes', 'write:users', etc.

  @Column()
  description!: string;
}
