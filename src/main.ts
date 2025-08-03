import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {



  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('RBAC API')
    .setDescription('Документация API для проекта RBAC')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')  // для авторизации через JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
