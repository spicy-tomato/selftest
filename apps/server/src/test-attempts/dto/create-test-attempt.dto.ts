import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AnswerSubmissionDto {
  @IsString()
  questionId: string;

  @IsArray()
  answerIds: string[];
}

export class CreateTestAttemptDto {
  @IsString()
  testId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerSubmissionDto)
  answers: AnswerSubmissionDto[];

  @IsDateString()
  startedAt: string;

  @IsDateString()
  completedAt: string;
}
