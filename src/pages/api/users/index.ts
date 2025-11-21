import type { NextApiRequest, NextApiResponse } from "next";
import connectToMongo from "@/lib/mongo";
import User from "@/lib/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    await connectToMongo();

    const { username, password, role, fullName, email, district } = req.body;

    if (!username || !password || !role || !fullName || !email) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .json({ ok: false, error: "Username already exists" });
    }

    const newUser = await User.create({
      username,
      password, // we ballin, no encryption n stuff
      role,
      fullName,
      email,
      district,
    });

    return res.status(201).json({ ok: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}
