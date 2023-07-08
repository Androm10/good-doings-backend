import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/common/types/user-from-request';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class IsFriendGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const friendId = req.query.userId;
    if (!friendId || friendId == user.id) {
      return true;
    }

    const result = await this.userService.isFriend(user.id, Number(friendId));
    if (!result) {
      throw new ForbiddenException('You must be a friend');
    }
    return true;
  }
}
