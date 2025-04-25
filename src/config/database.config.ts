import { registerAs } from '@nestjs/config';


export default registerAs('database', () => {
  const isDocker = process.env.NODE_ENV === 'production';
  const host = process.env.DATABASE_HOST || 'localhost';
  
  console.log('Using database host:', isDocker ? 'db (Docker)' : host);
  
  return {
    type: 'mysql',
    host: isDocker ? 'db' : host,
    port: process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USERNAME || 'todo_user',
    password: process.env.DATABASE_PASSWORD || 'todo_password',
    database: process.env.DATABASE_NAME || 'todo_list',
    entities: ['dist/**/*.entity{.ts,.js}'],
    // Permitimos synchronize incluso en producción para Docker
    synchronize: true,
    connectTimeout: 30000, // Aumentar timeout de conexión a 30 segundos
    retryAttempts: 10, // Intentar reconectar 10 veces
    retryDelay: 3000, // Esperar 3 segundos entre reintentos
    logging: true, // Activar logs para depuración
  };
});
