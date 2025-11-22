import type { NextApiRequest, NextApiResponse } from "next";

import { clearSessionCookie } from "@/lib/session";
import locale from "../../../locales/api.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ ok: false, error: locale.METHOD_NOT_ALLOWED });
  }

  res.setHeader("Set-Cookie", clearSessionCookie());
  return res.status(200).json({ ok: true });
}
