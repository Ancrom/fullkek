CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 16),
  email TEXT UNIQUE NOT NULL CHECK (email IS NOT NULL AND email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
  password TEXT NOT NULL CHECK (LENGTH(password) >= 8),
  "firstName" TEXT CHECK ("firstName" IS NULL OR LENGTH("firstName") <= 20),
  "lastName" TEXT CHECK ("lastName" IS NULL OR LENGTH("lastName") <= 20),
  "avatarUrl" TEXT CHECK ("avatarUrl" IS NULL OR "avatarUrl" ~ '^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:/[a-zA-Z0-9.-]*)*'),
  description TEXT CHECK (description IS NULL OR LENGTH(description) <= 100),
  birthday DATE CHECK (birthday IS NULL OR birthday <= CURRENT_DATE),
  "phoneNumber" TEXT CHECK ("phoneNumber" IS NULL OR LENGTH("phoneNumber") <= 20),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  "isActive" BOOLEAN DEFAULT TRUE,
  "emailVerified" BOOLEAN DEFAULT FALSE,
  "lastLoginAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


