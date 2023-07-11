import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserFromRequest } from 'src/common/decorators/user-from-request.decorator';
import { User } from 'src/common/types/user-from-request';
import { IsFriendGuard } from '../auth/guards/is-friend.guard';
import { DoingService } from './doing.service';
import { CreateDoingDto } from './dto/create-doing.dto';
import { GetDoingsDto } from './dto/get-doings.dto';
import { UpdateDoingDto } from './dto/update-doing.dto';

@ApiTags('doing')
@ApiBearerAuth('JWT-auth')
@Controller('doing')
export class DoingController {
  constructor(private doingService: DoingService) {}

  @Get(':id')
  get(@Param('id') id: number, @UserFromRequest() user: User) {
    return this.doingService.get(id, user.id);
  }

  @UseGuards(IsFriendGuard)
  @Get()
  getAll(@Query() { limit, page, ...filter }: GetDoingsDto) {
    return this.doingService.getAll(filter, limit, page);
  }

  @Post()
  create(
    @Body() createDoingDto: CreateDoingDto,
    @UserFromRequest() user: User,
  ) {
    return this.doingService.create({ ...createDoingDto, userId: user.id });
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateDoingDto: UpdateDoingDto,
    @UserFromRequest() user: User,
  ) {
    return this.doingService.update(id, updateDoingDto, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @UserFromRequest() user: User) {
    return this.doingService.delete(+id, user.id);
  }
}
