import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { UpdateQuestionBankDto } from './dto/update-question-bank.dto';

@Injectable()
export class QuestionBankService {
  constructor(private prisma: PrismaService) {}

  async createQuestionBank(userId: string, dto: CreateQuestionBankDto) {
    return this.prisma.questionBank.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        questions: {
          create: dto.questions.map((q) => ({
            questionText: q.questionText,
            explanation: q.explanation,
            type: q.type,
            answers: {
              create: q.answers.map((a) => ({
                answerText: a.answerText,
                isCorrect: a.isCorrect,
                explanation: a.explanation,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async getUserQuestionBanks(userId: string) {
    return this.prisma.questionBank.findMany({
      where: { userId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async getQuestionBankById(bankId: string, userId: string) {
    const bank = await this.prisma.questionBank.findFirst({
      where: {
        id: bankId,
        userId,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!bank) {
      throw new NotFoundException('Question bank not found');
    }

    return bank;
  }

  async updateQuestionBank(
    bankId: string,
    userId: string,
    dto: UpdateQuestionBankDto,
  ) {
    // Implement update logic with comprehensive validation
    return this.prisma.questionBank.update({
      where: {
        id: bankId,
        userId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        // Add more update logic for questions and answers
      },
    });
  }

  async deleteQuestionBank(bankId: string, userId: string) {
    return this.prisma.questionBank.deleteMany({
      where: {
        id: bankId,
        userId,
      },
    });
  }
}