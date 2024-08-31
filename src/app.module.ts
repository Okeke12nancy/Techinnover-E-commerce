import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { getTypeOrmConfig } from './config/database.config';
import { ProductsModule } from './module/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    UsersModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
