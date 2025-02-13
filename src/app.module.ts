import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { UsersModule } from './users/infrastructure/users.module'
import { AuthModule } from './auth/infrastructure/auth.module'
import { PetsModule } from './pets/infrastructure/pets.module'
import { ClinicScheduleModule } from './clinicschedule/infrastructure/clinic-schedule.module'
import { ClinicModule } from './clinic/infrastructure/clinic.module'
import { AppointmentModule } from './appointment/infrastructure/appointment.module'

@Module({
  imports: [
    EnvConfigModule,
    UsersModule,
    AuthModule,
    PetsModule,
    ClinicModule,
    ClinicScheduleModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
