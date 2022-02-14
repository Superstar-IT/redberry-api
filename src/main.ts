import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as DotEnv from 'dotenv';

async function bootstrap() {
  DotEnv.config();
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('RedBerry Test API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.enableCors({ origin: '*' });
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
