import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './seed/seed.module'; // Importamos el SeedModule
import databaseConfig from './config/database.config';
import { UserSubscriber } from './database/subscribers/user.subscriber';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbConfig = configService.get('database') as Record<string, any>;
        
        // Create a new configuration object instead of mutating the original
        return {
          ...dbConfig,
          subscribers: [UserSubscriber],
        };
      },
    }),
    DatabaseModule,
    TasksModule,
    UsersModule,
    AuthModule,
    SeedModule, // Añadimos el SeedModule aquí
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
