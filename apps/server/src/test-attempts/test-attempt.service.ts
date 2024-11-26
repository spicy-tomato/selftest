import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestAttemptDto } from '@server/test-attempts/dto/create-test-attempt.dto';
import { isEqual } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestAttemptService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTestAttemptDto) {
    const questionCorrectAnswers = await this.prisma.test.findFirst({
      where: { id: dto.testId },
      select: {
        questions: {
          select: {
            id: true,
            answers: {
              where: {
                isCorrect: true,
              },
            },
          },
        },
      },
    });

    if (!questionCorrectAnswers) {
      throw new NotFoundException('Test attempt not found');
    }

    let correctAnswersCount = 0;
    questionCorrectAnswers.questions.forEach((q) => {
      const answerIds = dto.answers.find(
        (a) => a.questionId === q.id,
      )?.answerIds;
      if (
        isEqual(
          answerIds,
          q.answers.map((x) => x.id),
        )
      ) {
        correctAnswersCount++;
      }
    });

    const score = correctAnswersCount / questionCorrectAnswers.questions.length;

    await this.prisma.testAttempt.create({
      data: {
        userId,
        testId: dto.testId,
        score,
        totalQuestions: questionCorrectAnswers.questions.length,
        correctAnswers: correctAnswersCount,
        startedAt: dto.startedAt,
        completedAt: dto.completedAt,
      },
    });

    return {
      answers: questionCorrectAnswers,
      score,
    };
  }

  async getListByUserId(userId: string) {
    return this.prisma.testAttempt.findMany({
      where: { userId },
    });
  }

  async getById(testAttemptId: string, userId: string) {
    const testAttempt = await this.prisma.testAttempt.findFirst({
      where: {
        id: testAttemptId,
        userId,
      },
      include: {
        test: {
          include: {
            questions: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });

    if (!testAttempt) {
      throw new NotFoundException('Test attempt not found');
    }

    return testAttempt;
  }
}
