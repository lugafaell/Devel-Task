import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { Directory } from './directory.entity';

@Controller('directories')
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) {}

  @Post()
  async create(@Body('name') name: string): Promise<Directory> {
    return this.directoriesService.create(name);
  }

  @Get()
  async findAll(): Promise<Directory[]> {
    return this.directoriesService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.directoriesService.remove(+id);
  }
}
