# To-Do List Application

## Descripción

Esta es una aplicación web de gestión de tareas (To-Do List) que permite a los usuarios registrarse, iniciar sesión, y gestionar sus tareas. La aplicación incluye autenticación basada en JWT para proteger las rutas y garantizar que solo los usuarios autenticados puedan acceder a sus tareas. La interfaz de usuario está desarrollada en Angular, mientras que el backend está construido en .NET Core con Entity Framework para la gestión de datos.

## Tecnologías Utilizadas

### Frontend

- **Angular 18**: Utilizado para construir la interfaz de usuario.
  - **JWT (JSON Web Token)**: Utilizado para la autenticación de usuarios.
  - **Angular Router**: Utilizado para la navegación y protección de rutas en la aplicación.

### Backend

- **.NET 8**: Framework principal utilizado para construir la API backend.
  - **Entity Framework Core**: ORM utilizado para la interacción con la base de datos.
  - **JWT Authentication**: Implementado para autenticar y autorizar a los usuarios.
  - **ASP.NET Core**: Utilizado para construir y gestionar la API.

## Características

### Frontend (Angular)

- **Registro e Inicio de Sesión**: Los usuarios pueden registrarse y autenticarse en la aplicación.
- **Gestión de Tareas**: Los usuarios pueden:
  - Agregar nuevas tareas.
  - Marcar tareas como completadas.
  - Eliminar tareas.
  - Solo los usuarios autenticados pueden realizar estas acciones.
- **Perfil de Usuario**: Muestra información del usuario autenticado.

### Backend (.NET Core)

- **Autenticación JWT**: La API protege las rutas asegurando que solo los usuarios autenticados puedan acceder a ellas.
- **Modelo de Datos de Tareas**: Incluye los siguientes campos:
  - `Id`: Identificador único de la tarea.
  - `Nombre`: Nombre de la tarea.
  - `Descripción`: Descripción detallada de la tarea.
  - `Completado`: Indica si la tarea ha sido completada.
  - `UserId`: Identifica al usuario al que pertenece la tarea.
- **Autorización**: Solo los usuarios autenticados pueden crear, ver, actualizar o eliminar sus propias tareas.
- **Entity Framework**: Utilizado para la interacción con la base de datos, permitiendo la creación, lectura, actualización y eliminación de tareas.

## Requisitos

### Frontend

- Node.js y npm instalados.
- Angular CLI instalado globalmente.

```bash
npm install -g @angular/cli
```

### Backend

- .NET 8 SDK instalado.
- MySql soportada por Entity Framework Core.
- Postman (opcional) para probar las rutas de la API.

## Instalación y Configuración

### General

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/IvanCaviedes/Sittycia-Prueba-Tecnica
   cd Sittycia-Prueba-Tecnica
   ```

### Backend

1. **Entar a la carpeta:**

   ```bash
   cd Backend
   ```

2. **Restaurar Depedencias:**
   ```bash
   dotnet restore
   ```
3. **Configuración de la base de datos y Jwt:**
   Configura la cadena de conexión a tu base de datos y jwt en el archivo `appsettings.json`. Ejemplo:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server={SERVER};user={USER};password={PASSWORD};database={DATABASE}"
  },
  "Jwt": {
    "Key": "TuClaveSuperSecreta",
    "Issuer": "tuApp",
    "Audience": "tuAppUsuarios",
    "Subject": "Subject"
  }
}
```

### Frontend

1. **Entar a la carpeta:**
   ```bash
   cd frontend
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Configurar la URL del backend: **
   Configura la URL de la API en los archivos de ambiente de Angular (src/environments/environment.ts):
   ```bash
    export const environment = {
      production: false,
      apiUrl: 'https://localhost:5001/api'
    };
   ```
4. **Correr la aplicación:**
   ```bash
   ng serve
   ```
   La aplicación estará disponible en http://localhost:4200.

## Uso

- **Registro:** Los usuarios pueden registrarse con un nuevo nombre de usuario y contraseña.
- **Inicio de sesión:** Los usuarios pueden iniciar sesión con sus credenciales para acceder a sus tareas.
- **Gestión de tareas:** Una vez autenticado, el usuario puede crear, ver, completar y eliminar tareas.
- **Perfil:** El usuario puede ver la información de su perfil.

## Pruebas

Para probar la API, puedes usar herramientas como Postman o curl. Asegúrate de incluir el token JWT en el encabezado Authorization en las solicitudes que requieren autenticación.

### Ejemplo de solicitud con curl:

```bash
curl -X GET "https://localhost:5001/api/tareas" -H "Authorization: Bearer TU_JWT_TOKEN"
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue los siguientes pasos:

- Haz un fork del proyecto.
- Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
- Realiza los cambios necesarios y haz commit (git commit -m 'Añadir nueva funcionalidad').
- Sube los cambios a la rama (git push origin feature/nueva-funcionalidad).
- Abre un Pull Request.
