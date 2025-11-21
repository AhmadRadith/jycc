import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import StudentAttendance from "@/models/StudentAttendance";
import { User } from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { studentId, status } = req.body;

      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendance = await StudentAttendance.findOneAndUpdate(
        { studentId, date: today },
        {
          studentId,
          schoolId: student.schoolId,
          date: today,
          status: status || "received",
          timestamp: new Date(),
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({ success: true, data: attendance });
    } catch (error) {
      console.error("Error saving attendance:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
