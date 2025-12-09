# **Полнофункциональное fullstack-приложение Fullkek.**
Fullstack приложения, построенная на Node.js с использованием Express и React + TypeScript.


## **Backend**

**Требования:**
- Node.js 16+
- npm или yarn

### **Установка и запуск backend**

1. **Клонирование репозитория**
```
git clone https://github.com/Ancrom/fullkek.git
cd fullkek/backend
```

2. **Установка зависимостей**
```
npm install
```

3. **Запуск**
```
npm run dev
```


### **API Эндпоинты**
**GET /health**

Проверка работоспособности сервера
```
Ответ: {"status":"OK"}
```

**GET /**

Домашняя страница API

**GET /about**

Информация о приложении


### **Линтинг**
Для проверки качества кода:
```
npm run lint
```

### **Changelog**
**v1.0.0**
- Базовая настройка Express
- Health check эндпоинт

