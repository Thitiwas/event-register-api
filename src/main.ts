import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const config = new DocumentBuilder()
    .setTitle('Event register example')
    .setDescription('The event register API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('event')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000)
}
bootstrap()
