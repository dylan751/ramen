import 'dotenv/config'; // load .env before anything else

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const corsOptions = {
  origin: [
    'https://hdwallet.toolhub.app',
    'https://www.hdwallet.toolhub.app',
    'https://cashbook.toolhub.app',
    'https://www.cashbook.toolhub.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsOptions });

  const config = new DocumentBuilder()
    .setTitle('GR API')
    .setDescription('GR API Description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs/v1', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(4000);
}
bootstrap();
