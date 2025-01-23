import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { UsersModule } from './users/infrastructure/users.module'
import { AuthService } from './auth/infrastructure/auth.service'
import { AuthModule } from './auth/infrastructure/auth.module'

@Module({
  imports: [EnvConfigModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
