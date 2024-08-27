import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Directory } from './directory.entity';

@Injectable()
export class DirectoriesService {
  constructor(
    @InjectRepository(Directory)
    private directoriesRepository: Repository<Directory>,
  ) {}

  create(directoryName: string): Promise<Directory> {
    const newDirectory = this.directoriesRepository.create({
      name: directoryName,
    });
    return this.directoriesRepository.save(newDirectory);
  }

  findAll(): Promise<Directory[]> {
    return this.directoriesRepository.find();
  }

  async remove(id: number): Promise<void> {
    const result = await this.directoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Directory with ID ${id} not found`);
    }
  }
}
