# Formulario de Pago - Tienda Nube

Sistema de procesamiento de pagos con React + Nimbus para Tienda Nube.

**Proyecto migrado a TypeScript** - Ver [TYPESCRIPT_MIGRATION.md](./TYPESCRIPT_MIGRATION.md) para más detalles.

## Requisitos

- Node.js 16 o superior
- npm

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

2. Instalar dependencias:

```bash
npm run install:all
```

3. Configurar variables de entorno:

```bash
cd web
cp .env.example .env
```

## Levantar el proyecto

### Opción 1: Usando el script de inicio (recomendado)

```bash
./start.sh
```

### Opción 2: Manualmente

Terminal 1 - Backend:

```bash
cd api
npm start
```

Terminal 2 - Frontend:

```bash
cd web
npm run dev
```

El frontend estará disponible en: http://localhost:3000
El backend estará disponible en: http://localhost:3001

## Endpoints de la API

Base URL: `http://localhost:3001`

### POST /tokens

Crea un token de tarjeta de crédito (tokenización).

**Request Body:**

```json
{
  "token": "tok_abc123xyz",
  "last4": "1111",
  "brand": "visa"
}
```

**Response exitosa (201):**

```json
{
  "token": "tok_abc123xyz",
  "last4": "1111",
  "brand": "visa",
  "createdAt": "2025-10-16T00:00:00.000Z",
  "id": 1
}
```

**Response error (402) - Tarjeta rechazada:**

```json
{
  "error": "Pago rechazado por el banco. Por favor, intenta con otra tarjeta."
}
```

**Response error (400) - Datos inválidos:**

```json
{
  "error": "Faltan campos requeridos: token, last4, brand"
}
```

### POST /payments

Registra un pago realizado.

**Request Body:**

```json
{
  "tokenId": 1,
  "token": "tok_abc123xyz",
  "last4": "1111",
  "brand": "visa",
  "cardholderName": "JUAN PEREZ",
  "dni": "12.345.678",
  "expiryDate": "12/25",
  "status": "success",
  "timestamp": "2025-10-16T00:00:00.000Z",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "language": "es-419"
  }
}
```

**Response exitosa (201):**

```json
{
  "tokenId": 1,
  "token": "tok_abc123xyz",
  "last4": "1111",
  "brand": "visa",
  "cardholderName": "JUAN PEREZ",
  "dni": "12.345.678",
  "expiryDate": "12/25",
  "status": "success",
  "timestamp": "2025-10-16T00:00:00.000Z",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "language": "es-419"
  },
  "createdAt": "2025-10-16T00:00:00.000Z",
  "id": 1
}
```

### GET /tokens

Obtiene todos los tokens creados.

**Response (200):**

```json
[
  {
    "token": "tok_abc123xyz",
    "last4": "1111",
    "brand": "visa",
    "createdAt": "2025-10-16T00:00:00.000Z",
    "id": 1
  }
]
```

### GET /payments

Obtiene todos los pagos registrados.

**Response (200):**

```json
[
  {
    "tokenId": 1,
    "token": "tok_abc123xyz",
    "last4": "1111",
    "brand": "visa",
    "cardholderName": "JUAN PEREZ",
    "dni": "12.345.678",
    "expiryDate": "12/25",
    "status": "success",
    "timestamp": "2025-10-16T00:00:00.000Z",
    "createdAt": "2025-10-16T00:00:00.000Z",
    "id": 1
  }
]
```

## Tarjetas de Prueba

### Tarjetas que APRUEBAN el pago

| Número              | Marca      | CVV | Fecha | Nombre          | DNI        |
| ------------------- | ---------- | --- | ----- | --------------- | ---------- |
| 4111 1111 1111 1111 | VISA       | 123 | 12/25 | JUAN PEREZ      | 12.345.678 |
| 5555 5555 5555 4444 | MASTERCARD | 123 | 12/25 | PEDRO RODRIGUEZ | 56.789.012 |

### Tarjetas que RECHAZAN el pago

| Número              | Marca      | CVV | Fecha | Nombre      | DNI        |
| ------------------- | ---------- | --- | ----- | ----------- | ---------- |
| 4242 4242 4242 0000 | VISA       | 123 | 12/25 | JUAN PEREZ  | 12.345.678 |
| 5105 1051 0510 9999 | MASTERCARD | 123 | 12/25 | MARIA GOMEZ | 23.456.789 |

## Estructura del Proyecto

```
├── api/          # Backend (Express)
├── web/          # Frontend (React + Vite)
└── package.json  # Scripts del monorepo
```

## Scripts Disponibles

- `npm run install:all` - Instala todas las dependencias
- `npm run dev` - Inicia backend y frontend simultáneamente
- `npm run dev:api` - Inicia solo el backend
- `npm run dev:web` - Inicia solo el frontend
- `npm run build` - Construye el frontend para producción
