# **Fullkek - Полнофункциональное Fullstack-приложение**

Fullstack приложение, построенное на Node.js с использованием Express и React + TypeScript. Приложение предоставляет REST API для управления пользователями с базой данных PostgreSQL.

## **Структура проекта**

```
fullkek/
├── backend/          # Backend на Node.js + Express + TypeScript
├── frontend/         # Frontend на React + TypeScript + Vite
└── infra/            # Docker Compose конфигурация и SQL скрипты
```

## **Технологический стек**

### Backend
- **Node.js** 16+
- **Express** 5.x
- **TypeScript**
- **PostgreSQL** 16
- **pg** (PostgreSQL клиент)

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **Axios**

### Инфраструктура
- **Docker** & **Docker Compose**
- **PostgreSQL** 16
- **Nginx** (для frontend)

## **ERD-схема базы данных**

```mermaid
erDiagram
    users {
        UUID id PK "PRIMARY KEY, DEFAULT gen_random_uuid()"
        TEXT username UK "UNIQUE, NOT NULL, CHECK (3-16 символов)"
        TEXT email UK "UNIQUE, NOT NULL, CHECK (валидный email)"
        TEXT password "NOT NULL, CHECK (>= 8 символов)"
        TEXT firstName "CHECK (<= 20 символов)"
        TEXT lastName "CHECK (<= 20 символов)"
        TEXT avatarUrl "CHECK (валидный URL)"
        TEXT description "CHECK (<= 100 символов)"
        DATE birthday "CHECK (<= CURRENT_DATE)"
        TEXT phoneNumber "CHECK (<= 20 символов)"
        TEXT role "DEFAULT 'user', CHECK (user|admin|moderator)"
        BOOLEAN isActive "DEFAULT TRUE"
        BOOLEAN emailVerified "DEFAULT FALSE"
        TIMESTAMP lastLoginAt
        TIMESTAMP createdAt "DEFAULT CURRENT_TIMESTAMP"
        TIMESTAMP updatedAt "DEFAULT CURRENT_TIMESTAMP"
    }
```

### Описание сущности Users

**Уникальные поля:**
- `id` - UUID идентификатор пользователя
- `email` - адрес электронной почты (уникальный)
- `username` - имя пользователя (уникальное, 3-16 символов)

**Read-only поля:**
- `emailVerified` - подтверждён ли email
- `createdAt` - дата и время создания
- `role` - роль пользователя (user, admin, moderator)
- `isActive` - статус активности
- `lastLoginAt` - дата и время последней авторизации

**Изменяемые поля:**
- `password` - хэш пароля (минимум 8 символов)
- `firstName` - имя (до 20 символов)
- `lastName` - фамилия (до 20 символов)
- `avatarUrl` - ссылка на аватар (валидный URL)
- `description` - описание (до 100 символов)
- `birthday` - день рождения
- `phoneNumber` - номер телефона (до 20 символов)

## **Переменные окружения**

### Настройка .env файлов

Проект использует разные `.env` файлы для Docker Compose и локальной разработки:

#### Для Docker Compose

Создайте файл `infra/.env` с переменными для Docker Compose:

```bash
cd infra
cp .env.example .env
```

Содержимое `infra/.env`:

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=fullkek_db
DB_USER=fullkek_user
DB_PASSWORD=fullkek_password
```

**Важно:** `DB_HOST=db` указывает на имя сервиса в Docker сети.

#### Для локальной разработки (без Docker)

Создайте файлы `.env` для backend и frontend:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Содержимое `backend/.env` для локальной разработки:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fullkek_db
DB_USER=fullkek_user
DB_PASSWORD=fullkek_password
```

**Важно:** Для локальной разработки используйте `DB_HOST=localhost` (а не `db`).

### Структура переменных окружения

- **`infra/.env`** - используется Docker Compose для подстановки переменных в `docker-compose.yml`
- **`backend/.env`** - используется при локальном запуске backend (`npm run dev`)
- **`frontend/.env`** - используется при локальном запуске frontend (`npm run dev`)

## **Установка и запуск**

### Предварительные требования

- Node.js 16+
- npm или yarn
- Docker и Docker Compose (для запуска через Docker)

### Запуск через Docker Compose

#### 1. Настройка переменных окружения

Убедитесь, что файл `infra/.env` создан и содержит необходимые переменные (см. раздел "Переменные окружения").

#### 2. Запуск сервисов

```bash
cd infra
docker-compose up -d
```

Сервисы будут доступны:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

**Примечание:** Docker Compose автоматически использует переменные из `infra/.env` для настройки всех сервисов. Переменные передаются в контейнеры через секцию `environment:` в `docker-compose.yml`.

## **API Эндпоинты**

Базовый URL: `http://localhost:3000/api`

### Health Check

**GET /api/health**

Проверка работоспособности сервера

```json
{
  "status": "OK"
}
```

### Users API

Полная документация API доступна в `backend/docs/users-api.md`

#### Получение списка пользователей

**GET /api/users?page={n}&limit={l}**

Параметры:
- `page` - номер страницы (положительное целое число от 1)
- `limit` - количество пользователей на страницу (от 1 до 100)

Пример: `GET /api/users?page=1&limit=20`

#### Получение пользователя по ID

**GET /api/users/{id}**

Пример: `GET /api/users/550e8400-e29b-41d4-a716-446655440000`

#### Создание пользователя

**POST /api/users**

Обязательные поля: `email`, `username`, `password`

#### Обновление пользователя

**PUT /api/users/{id}**

#### Удаление пользователя

**DELETE /api/users/{id}**

## **Разработка**

### Линтинг

Для проверки качества кода в backend:

```bash
cd backend
npm run lint
```

### Сборка

Backend:
```bash
cd backend
npm run build
```

Frontend:
```bash
cd frontend
npm run build
```

### Тестирование

```bash
cd backend
npm test
```

## **Changelog**

**v1.0.0**
- Базовая настройка Express
- Health check эндпоинт
- CRUD операции для пользователей
- Интеграция с PostgreSQL
- Docker Compose конфигурация
- React frontend с TypeScript
