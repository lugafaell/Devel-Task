import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get(':username')
  findTasksByUser(@Param('username') username: string) {
    return this.taskService.findTasksByUser(username);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number) {
    return this.taskService.deleteTask(id);
  }
}
