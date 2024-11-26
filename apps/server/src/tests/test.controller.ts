import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@server/common/decorators/user.decorator';
import { UserEntity } from '@server/common/entities/user.entity';
import { CreateTestDto } from './dto/create-test.dto';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  create(@Body() createTestDto: CreateTestDto, @User() user: UserEntity) {
    return this.testService.create(user.id, createTestDto);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.testService.getListByUserId(user.id);
  }
}
