# Autenticación JWT en el Sistema de Tutorías

## ¿Qué es JWT?

JWT (JSON Web Token) es un estándar abierto para crear tokens de acceso que permiten la transmisión segura de información entre partes. En nuestro sistema, JWT se utiliza para:

1. **Autenticación**: Verificar la identidad del usuario
2. **Autorización**: Determinar qué recursos puede acceder el usuario
3. **Sesiones sin estado**: Mantener la sesión del usuario sin almacenar datos en el servidor

## Estructura de un JWT

Un JWT tiene tres partes separadas por puntos (.):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImNvcnJlbyI6Imp1YW4ucGVyZXpAZXhhbXBsZS5jb20iLCJyb2wiOiJlc3R1ZGlhbnRlIiwiaWF0IjoxNzM0NzI5NjAwLCJleHAiOjE3MzQ4MTYwMDB9.signature
```

1. **Header**: Contiene el tipo de token y el algoritmo de firma
2. **Payload**: Contiene los datos del usuario (claims)
3. **Signature**: Firma digital que verifica la autenticidad

## Cómo funciona en nuestro sistema

### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "correo": "juan.perez@example.com",
  "contraseña": "password123"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@example.com",
    "rol": "estudiante"
  },
  "message": "Login exitoso"
}
```

### 2. Registro
```http
POST /auth/register
Content-Type: application/json

{
  "nombre": "María García",
  "correo": "maria.garcia@example.com",
  "contraseña": "password123",
  "rol": "tutor"
}
```

### 3. Acceso a endpoints protegidos
```http
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Roles en el sistema

- **estudiante**: Puede crear solicitudes de tutoría y ver sus propias solicitudes
- **tutor**: Puede aceptar/rechazar solicitudes y gestionar sesiones
- **coordinador**: Acceso completo al sistema, puede ver todas las solicitudes

## Cómo usar JWT en Swagger

### 1. Autenticarse
1. Ve a la documentación de Swagger en `/api`
2. Busca la sección "Autenticación"
3. Ejecuta el endpoint `POST /auth/login` con tus credenciales
4. Copia el `access_token` de la respuesta

### 2. Autorizar en Swagger
1. En la parte superior derecha de Swagger, haz clic en el botón "Authorize" (🔒)
2. En el campo "Value", pega tu token JWT con el formato: `Bearer tu_token_aqui`
3. Haz clic en "Authorize"
4. Cierra el modal

### 3. Usar endpoints protegidos
Ahora puedes acceder a todos los endpoints que requieren autenticación. Swagger automáticamente incluirá el header `Authorization: Bearer tu_token` en todas las peticiones.

## Ejemplo de uso en Swagger

1. **Login como estudiante:**
   ```json
   {
     "correo": "estudiante@example.com",
     "contraseña": "password123"
   }
   ```

2. **Crear una solicitud de tutoría:**
   ```json
   {
     "materia_id": 1,
     "fecha_solicitada": "2025-07-15",
     "hora_solicitada": "10:00:00"
   }
   ```

3. **Login como tutor:**
   ```json
   {
     "correo": "tutor@example.com",
     "contraseña": "password123"
   }
   ```

4. **Aceptar una solicitud:**
   ```
   POST /solicitudes/1/aceptar?tutorId=2
   ```

## Configuración de seguridad

### Variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
JWT_SECRET=tu-super-secret-jwt-key-cambia-esto-en-produccion
```

### Duración del token
Los tokens JWT expiran después de 24 horas por defecto. Esto se puede configurar en `src/auth/auth.module.ts`.

## Protección de endpoints

### Endpoints públicos (sin autenticación)
- `POST /auth/login`
- `POST /auth/register`

### Endpoints protegidos por rol
- **Solo estudiantes**: `POST /solicitudes`
- **Solo tutores y coordinadores**: `POST /solicitudes/:id/aceptar`
- **Solo coordinadores**: `GET /solicitudes` (ver todas)

### Endpoints con autenticación general
- `GET /auth/profile`
- `GET /solicitudes/estudiante/:id`
- `GET /solicitudes/tutor/:id`

## Manejo de errores

### 401 Unauthorized
- Token no proporcionado
- Token inválido
- Token expirado

### 403 Forbidden
- Usuario no tiene el rol requerido para acceder al recurso

### 400 Bad Request
- Datos de entrada inválidos
- Credenciales incorrectas

## Seguridad

1. **Nunca compartas tu JWT**: Los tokens contienen información sensible
2. **Usa HTTPS en producción**: Los tokens se transmiten en texto plano
3. **Configura un JWT_SECRET fuerte**: Usa una clave larga y aleatoria
4. **Revisa la expiración**: Los tokens expiran automáticamente
5. **No almacenes información sensible**: El payload del JWT es visible

## Testing

Para probar la autenticación:

1. Registra un usuario con cada rol
2. Haz login con cada usuario
3. Prueba acceder a endpoints con diferentes roles
4. Verifica que los endpoints protegidos rechacen acceso no autorizado 