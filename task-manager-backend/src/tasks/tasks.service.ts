import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './create-task.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private readonly userService: UsersService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, completed, date, username } = createTaskDto;

    const user = await this.userService.findOne(username);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const task = this.tasksRepository.create({
      title,
      description,
      completed,
      date,
      user,
    });

    return this.tasksRepository.save(task);
  }

  async findTasksByUser(username: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { user: { username: username } },
    });
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Task not found');
    }
  }
}
