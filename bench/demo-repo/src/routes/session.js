import { AUTH } from "../config/auth.shared.js";
export function createSession(res, userId) {
  res.setHeader("Set-Cookie", `${AUTH.sessionCookie}=${userId}; Max-Age=${AUTH.sessionTtlMinutes * 60}; HttpOnly`);
}
