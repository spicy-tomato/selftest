import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@server/common/decorators/user.decorator';
import { UserEntity } from '@server/common/entities/user.entity';
import { CreateQuestionBankDto } from './dto/create-question-bank.dto';
import { QuestionBankService } from './question-bank.service';

@Controller('question-banks')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Post()
  create(
    @Body() createQuestionBankDto: CreateQuestionBankDto,
    @User() user: UserEntity,
  ) {
    return this.questionBankService.create(user.id, createQuestionBankDto);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.questionBankService.getListByUserId(user.id);
  }
}
