CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	username TEXT UNIQUE,
	email TEXT UNIQUE,
  password TEXT,
  first_name TEXT,
	last_name TEXT,
	avatar_url TEXT,
  description TEXT,
	birthday DATE,
	phone TEXT,
	role TEXT DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  email_confirmed BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


