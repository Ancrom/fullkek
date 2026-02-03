import jwt from "jsonwebtoken";

export function getAuthCookie(
  payload = { id: "b6252555-eb50-4665-b476-b4ba5e3eaad3" },
) {
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!);
  return [`access_token=${token}`];
}
