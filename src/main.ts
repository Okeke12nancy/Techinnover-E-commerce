import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { getTypeOrmConfig } from './config/database.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const dataSource = new DataSource(getTypeOrmConfig());

  try {
    await dataSource.initialize();
    console.log('Database connection has been established successfully.');

    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Error during application startup:', error);
    process.exit(1);
  }
}

bootstrap();
