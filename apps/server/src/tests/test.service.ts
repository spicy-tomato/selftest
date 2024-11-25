import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTestDto) {
    return await this.prisma.test.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        isPublic: dto.isPublic,
        totalQuestions: dto.questionIds.length,
        createdAt: dto.createdAt,
        updatedAt: dto.createdAt,
      },
    });
  }

  async getListByUserId(userId: string) {
    return this.prisma.test.findMany({
      where: { userId },
    });
  }

  async getById(testId: string, userId: string) {
    const test = await this.prisma.test.findFirst({
      where: {
        id: testId,
        userId,
      },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    return test;
  }
}
