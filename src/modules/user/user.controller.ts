import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { UserFromRequest } from 'src/common/decorators/user-from-request.decorator';
import { User } from 'src/common/types/user-from-request';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  getProfile(@UserFromRequest() user: User) {
    return this.userService.get(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Put('profile/update')
  updateProfile(
    @UserFromRequest() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.id, updateUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('profile/add-friend/:publicId')
  addFriendByPublicId(
    @UserFromRequest() user: User,
    @Param('publicId') publicId: string,
  ) {
    return this.userService.addFriendByPublicId(user.id, publicId);
  }

  @NoAuth()
  @Get(':id')
  get(@Param('id') id: number) {
    return this.userService.get(id);
  }

  @NoAuth()
  @Get(':id/friends')
  getFriends(
    @Param('id') id: number,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.userService.getFriends(id, limit, page);
  }

  @NoAuth()
  @Get()
  getAll(@Query() { limit, page, ...filter }: GetUsersDto) {
    return this.userService.getAll(filter, limit, page);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(+id);
  }
}
