import type { IncomingMessage } from "http";

import type { RoleSlug } from "@/shared/roles";

export type SessionUser = {
  id: string;
  username: string;
  role: RoleSlug;
};

import dbConnect from "./mongo";
import { User } from "@/models/User";

export const SESSION_COOKIE_NAME = "mbg_session_v2";
const DEFAULT_SESSION_AGE_SECONDS = 24 * 60 * 60;
const REMEMBER_SESSION_AGE_SECONDS = 30 * 24 * 60 * 60;

const base64Encode = (value: string) =>
  Buffer.from(value, "utf8").toString("base64url");
const base64Decode = (value: string) =>
  Buffer.from(value, "base64url").toString("utf8");

const serializeSession = (payload: SessionUser) =>
  base64Encode(JSON.stringify(payload));

const parseCookies = (header?: string | null): Record<string, string> => {
  if (!header) {
    return {};
  }
  return header.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.split("=");
    if (!key) {
      return acc;
    }
    const normalizedKey = key.trim();
    const value = rest.join("=").trim();
    if (!normalizedKey) {
      return acc;
    }
    acc[normalizedKey] = value;
    return acc;
  }, {});
};

const deserializeSession = (raw?: string): SessionUser | null => {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(base64Decode(raw));
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.id &&
      parsed.username &&
      parsed.role
    ) {
      return {
        id: String(parsed.id),
        username: String(parsed.username),
        role: parsed.role as RoleSlug,
      };
    }
  } catch {
    return null;
  }
  return null;
};

export const authenticateUser = async (
  username: string,
  password: string
): Promise<SessionUser | null> => {
  await dbConnect();
  const normalizedUsername = username.trim().toLowerCase();

  const user = await User.findOne({ username: normalizedUsername });
  if (!user || user.password !== password) {
    return null;
  }

  return {
    id: user._id.toString(),
    username: user.username,
    role: user.role as RoleSlug,
  };
};

export const createSessionCookie = (
  user: SessionUser,
  remember = false
): string => {
  const parts = [
    `${SESSION_COOKIE_NAME}=${serializeSession(user)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  const maxAge = remember
    ? REMEMBER_SESSION_AGE_SECONDS
    : DEFAULT_SESSION_AGE_SECONDS;
  parts.push(`Max-Age=${maxAge}`);
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  return parts.join("; ");
};

export const clearSessionCookie = (): string => {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  return parts.join("; ");
};

export const getSessionUserFromCookies = (
  cookieHeader?: string | null
): SessionUser | null => {
  const cookies = parseCookies(cookieHeader);
  return deserializeSession(cookies[SESSION_COOKIE_NAME]);
};

export const getSessionUserFromRequest = (
  req: Pick<IncomingMessage, "headers">
): SessionUser | null =>
  getSessionUserFromCookies(req?.headers?.cookie ?? null);
