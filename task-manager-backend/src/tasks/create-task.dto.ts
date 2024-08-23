import { IsBoolean, IsString, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  date: string;

  @IsString()
  username: string;
}
