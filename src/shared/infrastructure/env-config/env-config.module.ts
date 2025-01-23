import { DynamicModule, Module } from '@nestjs/common'
import { EnvConfigService } from './env-config.service'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'
import { join } from 'node:path'

@Module({
  imports: [ConfigModule],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule {
  static async forRoot(
    options: ConfigModuleOptions = {},
  ): Promise<DynamicModule> {
    const dynamicModule = ConfigModule.forRoot({
      ...options,
      envFilePath: [
        join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      ],
    })

    return dynamicModule
  }
}
