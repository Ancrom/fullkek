# **Auth API**

## **REST API для аутентификации пользователей**

Аутентификация основана на JWT, хранимом в HttpOnly Cookie.
Токен автоматически отправляется браузером при каждом запросе.

Примечание:
SameSite=Strict предполагает, что frontend и backend работают на одном домене.

## **Базовый endpoint**

```
http://localhost:80/api
```

### **Аутентификация пользователя**

```
POST /auth/login - Аутентификация пользователя и создание сессии
```

Тело запроса:

```
{
	"email": "user@example.com",
	"password": "password123"
}
```

Поля тела запроса:

```
email: string    - уникальный и валидный email
password: string - минимум 8 символов
```

Пример запроса:

```
POST /auth/login
Content-Type: application/json

{
	"email": "user@example.com",
	"password": "password123"
}
```

Успешный ответ (200 ОК):

```
Set-Cookie: access_token=JWT;
            HttpOnly;
            Secure;
            SameSite=Strict;
            Path=/

{
  "id": "uuid",
  "email": "user@example.com",
  "username": "user",
  "role": "user"
}
```

Пример некорректного запроса:

```
POST /auth/login
Content-Type: application/json


{
  "password": "password123"
}
```

Неуспешный ответ (400 Bad Request):

```
{
	"code":"VALIDATION_ERROR",
	"message":"email and password are required"
}
```

Неуспешный ответ (401 Unauthorized):

```
{
	"code":"UNAUTHORIZED",
	"message": "Invalid email or password"
}
```

Коды ошибок:

- 400 Bad Request - Неверный формат данных или ошибка валидации
- 401 Unauthorized - Неверный email или пароль
- 500 Internal Server Error - Внутренняя ошибка сервера

### **Завершение сессии**

```
POST /auth/logout - Завершение пользовательской сессии
```

Пример запроса:

```
POST /auth/logout
```

Успешный ответ (204 No Content):

Коды ошибок:

- 500 Internal Server Error - Внутренняя ошибка сервера

### **Получение информации о текущем пользователе**

```
GET /auth/me - Проверка активной сессии и получение данных текущего пользователя
```

Пример запроса:

```
GET /auth/me
```

Успешный ответ (200 ОК):

```
{
	"id": "uuid",
	"email": "user@example.com",
	"username": "user",
	"role": "user"
}
```

Коды ошибок:

- 401 Unauthorized - Пользователь не авторизован
- 500 Internal Server Error - Внутренняя ошибка сервера

### **Обновление сессии**

```
POST /auth/refresh - Обновление access-токена
```

Пример запроса:

```
POST /auth/refresh
```

Успешный ответ (200 ОК):

```
Set-Cookie: access_token=NEW_JWT;
            HttpOnly;
            Secure;
            SameSite=Strict;
            Path=/

{
	"status": "refreshed"
}
```

Коды ошибок:

- 401 Unauthorized - Пользователь не авторизован
- 403 Forbidden - Пользователь не имеет доступа
- 500 Internal Server Error - Внутренняя ошибка сервера