import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Creating Application
  const app = await NestFactory.create(AppModule);
  
  // Get configuration service from app
  const configService = app.get(ConfigService);
  
  // Listening on retrieved port
  await app.listen(configService.get("port"));

  // Logging listening message
  Logger.log(`App is listening on port ${configService.get("port")} ...`, 'Bootstrap')
}
bootstrap();
