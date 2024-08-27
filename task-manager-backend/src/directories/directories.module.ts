import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectoriesService } from './directories.service';
import { DirectoriesController } from './directories.controller';
import { Directory } from './directory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Directory])],
  providers: [DirectoriesService],
  controllers: [DirectoriesController],
})
export class DirectoriesModule {}
