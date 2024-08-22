import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity'; // Ajuste o caminho conforme sua estrutura

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column()
  date: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
