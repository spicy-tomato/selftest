// src/test-attempt/dto/test-attempt-response.dto.ts
export class TestAttemptResponseDto {
  id: string;
  userId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: Date;
  completedAt?: Date;

  constructor(partial: Partial<TestAttemptResponseDto>) {
    Object.assign(this, partial);
  }
}
