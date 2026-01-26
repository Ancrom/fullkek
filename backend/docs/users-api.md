# **Users entity**

## **Базовые поля**

**Unique**

```
id: string                               - идентификатор
email: string                            - адрес электронной почты
username: string                         - имя пользователя
```

**Read-only**

```
emailConfirmed: boolean                   - подтверждён или нет адрес электронной почты
createdAt: Date                          - дата и время создания
role: 'user' | 'admin' |'moderator'      - роль пользователя
isActive?: boolean                       - статус активности
lastLoginAt: Date                        - дата и время последней авторизации
updatedAt: Date                          - дата и время последнего изменения
```

**Mutable**

```
password: string                         - хэш пароля
firstName: string                        - личное имя
lastName: string                         - личная фамилия
avatarUrl: string                        - ссылка на изображение
description: string                      - описание
birthday: Date                           - день рождения
phoneNumber: string                      - номер телефона
```

## **Users API**

REST API для управления пользователями. Предоставляет CRUD операции для работы с сущностью пользователя.

**Базовый endpoint**

```
http://localhost:80/api
```

### **Получение списка пользователей**

```
GET /users?page={n}&limit={l} - возвращает список пользователей
```

Параметры запроса в URL:

```
page: number  - номер страницы                         (положительное целое число от 1)
limit: number - количество пользователей на страницу   (положительное целое число от 1 до 100)
```

Пример запроса:

```
GET /users?page=1&limit=20
```

Успешный ответ (200 OK):

```
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "avatarUrl": "https://example.com/avatar.jpg",
      "description": "Software developer",
      "role": "user",
      "birthday": "12/25/2025",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
			"updatedAt": "2024-01-01T00:00:00Z",
      "phoneNumber": "+0-000-000-00-00"
    }
  ],
  "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
  }
}
```

Примеры некорректного запроса:

```
GET /users
GET /users?page=&limit=
GET /users?page=-1&limit=-1
GET /users?page=1&limit=10000000
GET /users?page=abc&limit=abc
```

Неуспешный ответ (400 Bad Request):

```
{
	"code":"VALIDATION_ERROR",
	"message":"Page and limit must be integers. Page >= 1, limit >= 1, limit <= 100"
}
```

Коды ошибок:

- 400 Bad Request - Ошибка валидации
- 500 Internal Server Error - Внутренняя ошибка сервера

### **Получение пользователя по идентификатору**

```
GET /users/{id} - Возвращает информацию о конкретном пользователе по его ID
```

Параметры запроса в URL:

```
id: string - UUID пользователя
```

Пример запроса:

```
GET /users/550e8400-e29b-41d4-a716-446655440000
```

Успешный ответ (200 OK):

```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "username": "johndoe",
	"password": "password",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "description": "Software developer",
  "birthday": "2025-12-25",
  "phoneNumber": "+0-000-000-00-00",
  "role": "user",
  "isActive": true,
  "emailConfirmed": false,
  "lastLoginAt": "2024-01-20T10:15:00Z",
  "createdAt": "2024-01-16T14:30:00Z",
	"updatedAt": "2024-01-01T00:00:00Z"
}
```

Примеры некорректного запроса:

```
GET /users/1
GET /users?page=-1&limit=-1
GET /users?page=1&limit=10000000
GET /users?page=abc&limit=abc
```

Неуспешный ответ (400 Bad Request):

```
{
	"code":"VALIDATION_ERROR",
	"message":"ID is not valid UUID"
}
```

Неуспешный ответ (404 Not Found):

```
{
	"code":"NOT_FOUND",
	"message":"User not found"
}
```

Коды ошибок:

- 400 Bad Request - Неверный формат ID
- 404 Not Found - Пользователь не найден
- 500 Internal Server Error - Внутренняя ошибка сервера

### Создание пользователя

```
POST /users - создаёт нового пользователя
```

Поля тела запроса:

```
email: string                            - уникальный и валидный email
username: string                         - уникальный username 3-16 букв и цифр
password: string                         - минимум 8 символов
firstName?: string                       - максимум 20 символов
lastName?: string                        - максимум 20 символов
avatarUrl?: string                       - валидный URL
description?: string                     - максимум 100 символов
birthday?: Date                          - дата
phoneNumber?: string                     - валидный номер телефона
```

Пример запроса:

```
POST /users
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "username": "johndoe",
	"password": "password",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "description": "Software developer",
  "birthday": "2025-12-25",
  "phoneNumber": "+0-000-000-00-00",
  "role": "user",
  "isActive": true,
  "emailConfirmed": false,
  "lastLoginAt": "2024-01-20T10:15:00Z",
  "createdAt": "2024-01-16T14:30:00Z",
	"updatedAt": "2024-01-01T00:00:00Z"
}
```

Успешный ответ (201 Created):

```
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "email": "jane.doe@example.com",
  "username": "janedoe",
  "firstName": "Jane",
  "lastName": "Doe",
  "avatarUrl": null,
  "description": null,
  "birthday": "2025-12-25",
  "phoneNumber": "+0-000-000-00-00"
  "role": "user",
  "isActive": true,
  "emailConfirmed": false,
  "lastLoginAt": null,
  "createdAt": "2024-01-16T14:30:00Z",
	"updatedAt": "2024-01-01T00:00:00Z"
}
```

Примеры некорректного запроса:

```
POST /users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "description": "Software developer",
  "birthday": "2025-12-25",
  "phoneNumber": "+0-000-000-00-00",
  "role": "user",
  "isActive": true,
  "emailConfirmed": false,
  "lastLoginAt": "2024-01-20T10:15:00Z",
  "createdAt": "2024-01-16T14:30:00Z"
}
```

Неуспешный ответ (400 Bad Request):

```
{
	"code":"VALIDATION_ERROR",
	"message":"email, username and password are required"
}
```

Неуспешный ответ (409 Bad Request):

```
{
	"code":"CONFLICT",
	"message":"User already exists"
}
```

Коды ошибок:

- 400 Bad Request - Отсутствуют необходимые поля, ошибка валидации полей
- 409 Conflict - Пользователь с таким email или username уже существует
- 500 Internal Server Error - Внутренняя ошибка сервера

### Обновление пользователя

```
PUT /users/{id} - обновляет информацию о пользователе по уникальному идентификатору
```

Параметры запроса в URL:

```
id: string - UUID пользователя
```

Тело запроса:

```
{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "description": "Software developer",
  "birthday": "12/25/2025",
  "phoneNumber": "+0-000-000-00-00"
}
```

Поля тела запроса:

```
email: string                            - уникальный и валидный email
username: string                         - уникальный username 3-16 букв и цифр
password: string                         - минимум 8 символов
firstName?: string                       - максимум 20 символов
lastName?: string                        - максимум 20 символов
avatarUrl?: string                       - валидный URL
description?: string                     - максимум 100 символов
birthday?: Date                          - дата
phoneNumber?: string                     - валидный номер телефона
```

Пример запроса:

```
PUT /users/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "description": "Software developer",
  "birthday": "2025-12-25",
  "phoneNumber": "+0-000-000-00-00",
  "role": "user",
  "isActive": true,
  "emailConfirmed": false,
  "lastLoginAt": "2024-01-20T10:15:00Z",
  "createdAt": "2024-01-16T14:30:00Z"
}
```

Успешный ответ (200 ОК):

```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "jane.doe@example.com",
  "username": "janedoe",
  "firstName": "Jane",
  "lastName": "Doe",
  "avatarUrl": null,
  "description": null,
  "birthday": "2025-12-25",
  "phoneNumber": "+0-000-000-00-00"
  "role": "user",
  "isActive": true,
  "emailConfirmed": false,
  "lastLoginAt": null,
  "createdAt": "2024-01-16T14:30:00Z",
	"updatedAt": "2024-01-01T00:00:00Z"
}
```

Примеры некорректного запроса:

```
PUT /users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "description": "Software developer",
  "birthday": "2025-12-25",
  "phoneNumber": "+0-000-000-00-00",
  "role": "user",
  "isActive": true,
  "emailConfirmed": false,
  "lastLoginAt": "2024-01-20T10:15:00Z",
  "createdAt": "2024-01-16T14:30:00Z",
	"updatedAt": "2024-01-01T00:00:00Z"
}
```

Неуспешный ответ (400 Bad Request):

```
{
	"code":"VALIDATION_ERROR",
	"message":"email, username and password are required"
}
```

Неуспешный ответ (404 Bad Request):

```
{
	"code":"NOT_FOUND",
	"message":"User not found""
}
```

Коды ошибок:

- 400 Bad Request - Неверный формат данных или ошибка валидации
- 404 Not Found - Пользователь не найден
- 500 Internal Server Error - Внутренняя ошибка сервера

### Удаление пользователя

```
DELETE /users/{id} - удаляет пользователя из системы по уникальному идентификатору
```

Параметры запроса в URL:

```
id: string - UUID пользователя
```

Пример запроса:

```
DELETE /users/550e8400-e29b-41d4-a716-446655440000
```

Успешный ответ (204 No Content):

```
{
	message: "User deleted successfully"
}
```

Примеры некорректного запроса:

```
DELETE /users/123
```

Неуспешный ответ (400 Bad Request):

```
{
	"code":"VALIDATION_ERROR",
	"message":"ID is not valid UUID""
}
```

Коды ошибок:

- 400 Bad Request - Неверный формат ID
- 500 Internal Server Error - Внутренняя ошибка сервера

### **Краткая таблица**

| Метод  | Endpoint    | Идемпотентность |
| ------ | ----------- | --------------- |
| GET    | /users      | ✅ Да           |
| GET    | /users/{id} | ✅ Да           |
| POST   | /users      | ❌ Нет          |
| PUT    | /users/{id} | ✅ Да           |
| DELETE | /users/{id} | ✅ Да           |
