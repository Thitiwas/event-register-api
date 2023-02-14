import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from './constants'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
    JwtAuthGuard['_this'] = this
  }
  private static _this: JwtAuthGuard
  private request: any
  private user: any = {
    sub: 1,
    email: 'admin@email.com'
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }
    const request = context.switchToHttp().getRequest()

    JwtAuthGuard.setRequest(request)

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context)
  }

  private static setRequest(request: Request) {
    return (JwtAuthGuard._this.request = request)
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    this.setAuthorizedUser(user)
    return user
  }

  private setAuthorizedUser(user) {
    JwtAuthGuard['_this'].user = user
  }

  public static getAuthorizedUserId(): any {
    return JwtAuthGuard['_this'] ? JwtAuthGuard['_this'].user.sub : 0
  }
  public static getTokenFromRequest(): any {
    return JwtAuthGuard['_this'].request.headers.authorization
  }
}
