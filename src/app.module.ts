import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import pg from 'pg'
import { UserModule } from './user/user.module'
import { TokenModule } from './token/token.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from './pipes/validator.pipe'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { RolesGuard } from './auth/role.guard'

const AppProvider = [
  {
    provide: APP_PIPE,
    useClass: ValidationPipe
  },
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard
  }
]
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: `${process.env.DBHOST}`,
      port: 5432,
      username: `${process.env.DBUSERNAME}`,
      password: `${process.env.DBPASS}`,
      database: `${process.env.DBNAME}`,
      synchronize: true,
      autoLoadModels: true,
      retryAttempts: 2,
      schema: `${process.env.DBSCHEMA}`,
      dialectModule: pg
    }),
    UserModule,
    TokenModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [...AppProvider]
})
export class AppModule {}
