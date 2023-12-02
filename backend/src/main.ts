// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { initializeApp } from 'firebase/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const firebaseConfig = {
    apiKey: 'AIzaSyAz7Wk483sls5XVuHhysbQnyUpOWegIvnk',

    authDomain: 'awp-hql.firebaseapp.com',

    projectId: 'awp-hql',

    storageBucket: 'awp-hql.appspot.com',

    messagingSenderId: '280816673390',

    appId: '1:280816673390:web:70efd2ac5bf96335497c7f',
  };
  // // Initialize Firebase

  // const app = initializeApp(firebaseConfig);
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'jwt',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt', // This name should match the security name defined below
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(4000);
}
bootstrap();
