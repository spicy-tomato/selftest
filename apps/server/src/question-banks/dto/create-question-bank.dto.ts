import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { QuestionType } from '@prisma/client';

export class CreateAnswerDto {
  @IsString()
  answerText: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsString()
  @IsOptional()
  explanation?: string;
}

export class CreateQuestionDto {
  @IsString()
  questionText: string;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  @ArrayMinSize(1)
  answers: CreateAnswerDto[];
}

export class CreateQuestionBankDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @ArrayMinSize(1)
  questions: CreateQuestionDto[];

  @IsDateString()
  createdAt: string;
}
