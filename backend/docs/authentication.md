# Authentication

## Тип аутентификации

Аутентификация на базе **JWT (JSON Web Tokens)** с хранением токена в **HttpOnly Cookie**.

## Основные компоненты

### Backend

- **argon2** - хэширование и верификация паролей
- **Users API** - регистрация пользователей (Sign Up)
- **Auth API** - endpoint’ы аутентификации (Login / Logout)
- **JWT** - генерация токена доступа
- **Cookie** - установка JWT с флагами `HttpOnly`, `Secure`, `SameSite=Strict`
- **Auth Middleware** - проверка JWT из Cookie (`req.cookies`)

---

### Frontend

- **Login page** - форма входа пользователя
- **HttpOnly Cookie** - хранение JWT
- **Logout** - завершение сессии через endpoint backend (очистка Cookie)

---

## Технологический стек

- **JWT** - создание и валидация токенов аутентификации
- **argon2** - безопасное хэширование паролей
- **cookie-parser** - парсинг Cookie на backend
- **Axios** - HTTP-клиент для взаимодействия с API
- **TanStack Query** - управление состоянием запросов, кэшированием и рефетчем

---

## Схема аутентификации

### Регистрация (Sign Up)

```
React
  → Axios (POST)
    → Node.js (Users API)
      → argon2.hash
        → PostgreSQL
```

- Пользователь отправляет регистрационные данные
- Пароль хэшируется с помощью `argon2`
- Пользователь сохраняется в базе данных

---

### Вход (Login)

```
React
  → Axios (POST)
    → Node.js (Auth API)
      → argon2.verify
        → JWT
          → Set-Cookie (HttpOnly)
```

- Пользователь отправляет логин и пароль
- Backend верифицирует пароль с хэшем в БД
- В случае успеха создаётся JWT
- JWT отправляется клиенту через `Set-Cookie`

---

### Авторизация запросов

- Cookie автоматически отправляется браузером при каждом запросе
- Axios использует `withCredentials: true`
- Auth Middleware:
  - извлекает JWT из Cookie
  - валидирует токен
  - добавляет данные пользователя в `req.user`

---

### Проверка сессии

- При инициализации приложения:
  - **TanStack Query** запрашивает endpoint проверки сессии (`/auth/me`)
  - Backend валидирует Cookie
  - Возвращает данные пользователя или `401 Unauthorized`

---

### Выход (Logout)

- Frontend вызывает `/auth/logout`
- Backend очищает Cookie (`res.clearCookie`)
- Сессия пользователя считается завершённой
