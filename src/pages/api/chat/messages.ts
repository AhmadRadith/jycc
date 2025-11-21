import type { NextApiRequest, NextApiResponse } from "next";

import connectToMongo from "@/lib/mongo";
import { ChatMessage } from "@/lib/models/ChatMessage";
import { getSessionUserFromRequest } from "@/lib/session";

const FIXED_TICKET_ID = "tiket-0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getSessionUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  }
  try {
    await connectToMongo();
  } catch (error) {
    console.error("Mongo connection error in /api/chat/messages:", error);
    return res.status(500).json({ ok: false, error: "DB_CONNECTION_FAILED" });
  }

  if (req.method === "GET") {
    return handleGetMessages(req, res);
  }

  if (req.method === "POST") {
    return handlePostMessage(req, res, user.id, user.username);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
}

async function handleGetMessages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const messages = await ChatMessage.find({ ticketId: FIXED_TICKET_ID })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    return res.status(200).json({ ok: true, messages });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, error: "FAILED_TO_FETCH_MESSAGES" });
  }
}

async function handlePostMessage(
  req: NextApiRequest,
  res: NextApiResponse,
  senderId: string,
  senderName: string
) {
  const { text, imageData } = req.body ?? {};

  if (
    (typeof text !== "string" || text.trim().length === 0) &&
    typeof imageData !== "string"
  ) {
    return res.status(400).json({ ok: false, error: "EMPTY_MESSAGE" });
  }

  if (imageData && typeof imageData !== "string") {
    return res.status(400).json({ ok: false, error: "INVALID_IMAGE_DATA" });
  }

  if (imageData && imageData.length > 2_000_000) {
    return res.status(413).json({ ok: false, error: "IMAGE_TOO_LARGE" });
  }

  try {
    const doc = await ChatMessage.create({
      ticketId: FIXED_TICKET_ID,
      senderId,
      senderName,
      text: typeof text === "string" ? text.trim() : "",
      imageData: typeof imageData === "string" ? imageData : undefined,
      createdAt: new Date(),
    });

    return res.status(201).json({ ok: true, message: doc });
  } catch {
    return res.status(500).json({ ok: false, error: "FAILED_TO_SAVE_MESSAGE" });
  }
}
