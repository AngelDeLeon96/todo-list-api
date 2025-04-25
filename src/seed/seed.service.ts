import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    await this.createStandardUser();
  }

  private async createStandardUser() {
    try {
      // Comprobar si el usuario estándar ya existe
      try {
        await this.usersService.findByUsername('admin');
        this.logger.log('Usuario estándar ya existe, omitiendo creación');
        return;
      } catch (error) {
        // Si el usuario no existe, continuamos con la creación
      }

      const standardUser: CreateUserDto = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin123!',
        fullName: 'Administrador',
      };

      const createdUser = await this.usersService.create(standardUser);
      this.logger.log(`Usuario estándar creado con ID: ${createdUser.id}`);
    } catch (error) {
      this.logger.error(`Error al crear usuario estándar: ${error.message}`);
    }
  }
}