import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Logger, OnModuleInit } from '@nestjs/common';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User>, OnModuleInit {
  private readonly logger = new Logger(UserSubscriber.name);
  private isInitialized = false;
  private initAttempts = 0;
  private readonly MAX_ATTEMPTS = 5;

  constructor(private dataSource: DataSource) {
    if (dataSource && dataSource.subscribers) {
      dataSource.subscribers.push(this);
    } else {
      this.logger.warn('DataSource or dataSource.subscribers is undefined. Subscriber not registered automatically.');
    }
  }

  // Implementación de OnModuleInit para asegurar que se ejecute después de que NestJS haya iniciado
  async onModuleInit() {
    // Retrasamos la inicialización para asegurar que TypeORM haya terminado de sincronizar las tablas
    setTimeout(() => {
      this.initializeAdminUser().catch(err => 
        this.logger.error(`Error al inicializar usuario administrador: ${err.message}`)
      );
    }, 3000); // Incrementamos el retraso inicial a 3 segundos
  }

  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<User>) {
    // Registrar la creación de usuarios para depuración
    this.logger.log(`Usuario creado: ${event.entity.username}`);
  }

  private async initializeAdminUser() {
    if (this.isInitialized) return;
    
    if (this.initAttempts >= this.MAX_ATTEMPTS) {
      this.logger.warn(`Máximo número de intentos (${this.MAX_ATTEMPTS}) alcanzado. No se pudo crear el usuario administrador.`);
      return;
    }
    
    this.initAttempts++;
    const entityManager = this.dataSource.manager;
    
    try {
      this.logger.log(`Intento ${this.initAttempts}: Verificando existencia del usuario administrador...`);
      
      // Primero verificamos que la tabla exista
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        throw new Error("Table 'user' doesn't exist yet");
      }

      // Comprobar si ya existe el usuario admin
      const adminExists = await entityManager.findOneBy(User, { username: 'admin' });

      if (!adminExists) {
        this.logger.log('Creando usuario administrador...');
        
        // Crear usuario administrador si no existe
        const adminUser = new User();
        adminUser.username = 'admin';
        adminUser.email = 'admin@example.com';
        adminUser.password = 'Admin123!'; // Se aplicará hash automáticamente mediante el hook BeforeInsert
        adminUser.fullName = 'Administrador';

        await entityManager.save(adminUser);
        this.logger.log('Usuario administrador creado automáticamente');
        this.isInitialized = true;
      } else {
        this.logger.log('Usuario administrador ya existe');
        this.isInitialized = true;
      }
    } catch (error) {
      this.logger.warn(`Error al inicializar usuario administrador (intento ${this.initAttempts}): ${error.message}`);
      
      // Programar un nuevo intento con tiempo de espera exponencial
      const retryDelay = Math.min(2000 * Math.pow(2, this.initAttempts - 1), 10000);
      this.logger.log(`Reintentando en ${retryDelay}ms...`);
      setTimeout(() => this.initializeAdminUser(), retryDelay);
    }
  }
  
  private async checkTableExists(): Promise<boolean> {
    try {
      // Consultar el esquema de la base de datos para verificar si la tabla existe
      const query = this.dataSource.driver.options.type === 'mysql'
        ? `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'user'`
        : `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='user'`;
      
      const result = await this.dataSource.query(query);
      return result[0].count > 0;
    } catch (error) {
      this.logger.warn(`Error al verificar si existe la tabla: ${error.message}`);
      return false;
    }
  }
}