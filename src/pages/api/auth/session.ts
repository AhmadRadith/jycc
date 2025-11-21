import type { NextApiRequest, NextApiResponse } from "next";
import { getSessionUserFromRequest } from "@/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getSessionUserFromRequest(req);

  if (!user) {
    return res.status(200).json({ user: null });
  }

  return res.status(200).json({ user });
}
