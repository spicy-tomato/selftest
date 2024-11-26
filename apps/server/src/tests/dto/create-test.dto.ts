import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateTestDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  questionIds: string[];

  @IsDateString()
  createdAt: string;
}
