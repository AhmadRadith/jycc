import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import Polling from "@/models/Polling";
import { User } from "@/models/User";
import { getSessionUserFromRequest } from "@/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const session = getSessionUserFromRequest(req);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const student = await User.findById(session.id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  if (req.method === "GET") {
    try {
      const myVote = await Polling.findOne({ studentId: student._id });

      const stats = await Polling.aggregate([
        { $match: { schoolId: student.schoolId } },
        {
          $group: {
            _id: "$menuChoice",
            count: { $sum: 1 },
          },
        },
      ]);

      const formattedStats = stats.map((s) => ({
        name: s._id,
        value: s.count,
      }));

      return res.status(200).json({
        myVote,
        stats: formattedStats,
      });
    } catch (error) {
      console.error("Error fetching polling data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { menuChoice, suggestion } = req.body;

      if (!menuChoice) {
        return res.status(400).json({ error: "Menu choice is required" });
      }

      const polling = await Polling.findOneAndUpdate(
        { studentId: student._id },
        {
          studentId: student._id,
          schoolId: student.schoolId,
          menuChoice,
          suggestion,
          createdAt: new Date(), 
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({ success: true, data: polling });
    } catch (error) {
      console.error("Error submitting polling:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
