import type { NextApiRequest, NextApiResponse } from "next";

import { authenticateUser, createSessionCookie } from "@/lib/session";
import { sanitizeNextPath, DEFAULT_NEXT_PATH } from "@/shared/navigation";
import { getDashboardPathForRole } from "@/shared/roles";
import locale from "../../../locales/api.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ ok: false, error: locale.METHOD_NOT_ALLOWED });
  }

  const { username, password, remember, next } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ ok: false, error: locale.MISSING_CREDENTIALS });
  }

  const user = await authenticateUser(username, password);
  if (!user) {
    return res
      .status(401)
      .json({ ok: false, error: locale.INVALID_CREDENTIALS });
  }

  const nextPath = sanitizeNextPath(
    next,
    getDashboardPathForRole(user.role) ?? DEFAULT_NEXT_PATH
  );
  const rememberFlag = Boolean(remember);
  res.setHeader("Set-Cookie", createSessionCookie(user, rememberFlag));

  return res.status(200).json({ ok: true, redirect: nextPath });
}
