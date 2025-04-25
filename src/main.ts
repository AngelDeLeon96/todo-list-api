import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Esperar a que la base de datos esté lista
  if (process.env.NODE_ENV === 'production') {
    logger.log('Esperando a que la base de datos esté disponible...');
    await new Promise((resolve) => setTimeout(resolve, 15000)); // Espera 15 segundos
  }
  
  // Las variables de entorno ya estarán disponibles gracias al flag --env-file
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Usar el puerto 3000 para Docker (definido en docker-compose.yml)
  const port = process.env.NODE_ENV === 'production'
    ? 3000
    : configService.get<number>('PORT') || 3000;
  
  logger.log(`Application starting on port: ${port}`);
  await app.listen(port);
}

// Añadir void para marcar explícitamente que ignoramos la promesa
void bootstrap();
