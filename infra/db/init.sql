CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
	username TEXT UNIQUE NOT NULL,
	email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
	last_name TEXT,
	avatar_url TEXT,
  description TEXT,
	birthday DATE,
	phone TEXT,
	role TEXT DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  email_confirmed BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users (username);

CREATE TABLE IF NOT EXISTS sessions (
	id UUID PRIMARY KEY,
	user_id UUID NOT NULL,
	token_hash TEXT NOT NULL,
	expires_at TIMESTAMP
)