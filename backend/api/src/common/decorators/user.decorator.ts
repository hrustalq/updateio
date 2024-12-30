import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../domains/users/interfaces/user.interface';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
