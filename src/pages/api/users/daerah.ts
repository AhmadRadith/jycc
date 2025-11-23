import type { NextApiRequest, NextApiResponse } from "next";
import connectToMongo from "@/lib/mongo";
import User from "@/lib/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    await connectToMongo();

    const daerahUsers = await User.find({ role: "daerah" })
      .select("username fullName district email")
      .lean();

    return res.status(200).json({ ok: true, users: daerahUsers });
  } catch (error) {
    console.error("Error fetching daerah users:", error);
    return res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}
