# Todo List API

Una API REST para gestionar tareas construida con NestJS, TypeORM y autenticación JWT.

## Descripción

Este proyecto es una API de lista de tareas que permite a los usuarios registrarse, iniciar sesión, y gestionar sus tareas personales. La API proporciona endpoints para crear, leer, actualizar y eliminar tareas, así como para la autenticación de usuarios.

## Tecnologías

- [NestJS](https://nestjs.com/) - Framework para construir aplicaciones Node.js eficientes y escalables
- [TypeORM](https://typeorm.io/) - ORM para TypeScript y JavaScript
- [JWT](https://jwt.io/) - JSON Web Tokens para autenticación
- [MySQL](https://www.mysql.com/) - Base de datos relacional
- [Docker](https://www.docker.com/) - Contenedores para desarrollo y despliegue

## Requisitos previos

- Node.js (v18 o superior)
- npm o pnpm
- Docker y docker-compose (opcional, para desarrollo con contenedores)
- MySQL (si no se usa Docker)

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd todo-list-api
```

2. Instalar dependencias:

```bash
pnpm install
# o con npm
npm install
```

3. Configurar variables de entorno:

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=todolist

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600s
```

## Ejecución con Docker

Para iniciar la aplicación con Docker:

```bash
docker-compose up
```

Esto iniciará tanto la API como la base de datos MySQL.

## Ejecución local

1. Inicia la aplicación en modo desarrollo:

```bash
pnpm start:dev
# o con npm
npm run start:dev
```

2. Para producción:

```bash
pnpm build
pnpm start:prod
# o con npm
npm run build
npm run start:prod
```

## Usuario por defecto

La aplicación cuenta con un usuario administrador predeterminado que se crea automáticamente al iniciar:

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

Puedes utilizar estas credenciales para probar la API inmediatamente después de la instalación.

## Endpoints principales

### Autenticación

- `POST /auth/register` - Registrar un nuevo usuario
- `POST /auth/login` - Iniciar sesión y obtener token JWT

### Tareas

- `GET /tasks` - Obtener todas las tareas del usuario
- `GET /tasks/:id` - Obtener una tarea específica
- `POST /tasks` - Crear una nueva tarea
- `PATCH /tasks/:id` - Actualizar una tarea existente
- `DELETE /tasks/:id` - Eliminar una tarea

## Testing

Para ejecutar los tests:

```bash
# Tests unitarios
pnpm test

# Tests e2e
pnpm test:e2e

# Cobertura de tests
pnpm test:cov
```

## Estructura del proyecto

```
src/
  ├── auth/               # Autenticación y autorización
  ├── config/             # Configuraciones de la aplicación
  ├── database/           # Configuración de la base de datos
  ├── tasks/              # Módulo de tareas
  ├── users/              # Módulo de usuarios
  ├── app.module.ts       # Módulo principal de la aplicación
  └── main.ts             # Punto de entrada de la aplicación
```

## Licencia

Este proyecto está bajo la Licencia [UNLICENSED](LICENSE).
