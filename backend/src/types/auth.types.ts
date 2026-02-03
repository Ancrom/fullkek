export interface ISession {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface IJWTPayload {
	sub: string;
	role: "user" | "admin" | "moderator";
}