import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@server/common/decorators/user.decorator';
import { UserEntity } from '@server/common/entities/user.entity';
import { TestAttemptService } from './test-attempt.service';
import { CreateTestAttemptDto } from '@server/test-attempts/dto/create-test-attempt.dto';

@Controller('test-attempts')
export class TestAttemptController {
  constructor(private readonly testAttemptService: TestAttemptService) {}

  @Post()
  create(
    @Body() createTestAttemptDto: CreateTestAttemptDto,
    @User() user: UserEntity,
  ) {
    return this.testAttemptService.create(user.id, createTestAttemptDto);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.testAttemptService.getListByUserId(user.id);
  }
}
