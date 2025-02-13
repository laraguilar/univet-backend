import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import * as fs from 'fs'

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('path/to/private-key.pem'),
  //   cert: fs.readFileSync('path/to/certificate.pem'),
  // }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // new FastifyAdapter({
    //   logger: true,
    //   https: httpsOptions,
    // }),
    new FastifyAdapter(),
    {
      cors: {
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
      },
    },
  )

  // app.enableCors({
  //   origin: true,
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // })

  const port = process.env.PORT ?? 3000
  await app.listen(port, '0.0.0.0')
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
