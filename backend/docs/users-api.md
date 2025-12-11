# **Users entity**

## **Базовые поля**

**Unique**
```
id: string                                - идентификатор
email: string                             - адрес электронной почты
username: string                          - имя пользователя
```
**Read-only**
```
emailVerified: boolean                    - подтверждён или нет адрес электронной почты
createdAt: Date                           - дата и время создания
role: 'user' | 'admin' |'moderator'       - роль пользователя
isActive?: boolean                        - статус активности
lastLoginAt: Date                         - дата и время последней авторизации
```
**Mutable**
```
password: string                          - хэш пароля
firstName?: string                        - личное имя
lastName?: string                         - личная фамилия
avatarUrl?: string                        - ссылка на изображение
description?: string                      - описание
birthday?: Date                           - день рождения
phoneNumber?: string                      - номер телефона
```

## **Users API**

REST API для управления пользователями. Предоставляет CRUD операции для работы с сущностью пользователя.

**Базовый endpoint**
```
http://localhost:5000/
```

### **Получение списка всех пользователей**
```
GET /users - возвращает список пользователей
```

Параметры запроса в URL:
```
page?: number  - номер страницы                       (по умолчанию: 1)
limit?: number - количество пользователей на страницу (по умолчанию: 10)
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
Коды ошибок:
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
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "email": "john.doe@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "description": "Software developer",
  "birthday": "2025-12-25",
  "phoneNumber": "+0-000-000-00-00",
  "role": "user",
  "isActive": true,
  "emailVerified": false,
  "lastLoginAt": "2024-01-20T10:15:00Z",
  "createdAt": "2024-01-16T14:30:00Z"
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
email: string        - должен быть валидный email
username: string     - 3-30 букв и цифр
password: string     - минимум 6 символов
firstName?: string   - максимум 20 символов
lastName?:           - максимум 20 символов
avatarUrl?: string    - валидный URL
description?: string - максимум 500 символов
birthday?: Date      - дата
phoneNumber?: string - валидный номер телефона
```
Пример запроса:
```
POST /users
Content-Type: application/json

{
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "description": "Software developer",
    "birthday": "12/25/2025",
    "phoneNumber": "+0-000-000-00-00"
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
  "emailVerified": false,
  "lastLoginAt": null,
  "createdAt": "2024-01-16T14:30:00Z"
}
```
Коды ошибок:
```
400 Bad Request - Неверный формат данных или ошибка валидации
409 Conflict - Пользователь с таким email или username уже существует
500 Internal Server Error - Внутренняя ошибка сервера
```
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
email: string        - должен быть валидный email
password: string     - минимум 6 символов
firstName?: string   - максимум 20 символов
lastName?:           - максимум 20 символов
avatarUrl?: string   - валидный URL
description?: string - максимум 500 символов
birthday?: Date      - дата
phoneNumber?: string - валидный номер телефона
```
Пример запроса:
```
PUT /users/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

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
Успешный ответ (200 ОК):
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
  "emailVerified": false,
  "lastLoginAt": null,
  "createdAt": "2024-01-16T14:30:00Z"
}
```
Коды ошибок:
```
400 Bad Request - Неверный формат данных или ошибка валидации
404 Not Found - Пользователь не найден
500 Internal Server Error - Внутренняя ошибка сервера
```

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
(пустое тело)
```
Коды ошибок:
```
400 Bad Request - Неверный формат ID
500 Internal Server Error - Внутренняя ошибка сервера
```







