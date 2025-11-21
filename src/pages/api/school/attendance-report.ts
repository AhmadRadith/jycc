import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import StudentAttendance from "@/models/StudentAttendance";
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

  const user = await User.findById(session.id);
  if (!user || !user.schoolId) {
    return res.status(400).json({ error: "User not associated with a school" });
  }

  const schoolId = user.schoolId;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const students = await User.find({ role: "murid", schoolId }).select(
      "fullName class gender"
    );

    const attendanceRecords = await StudentAttendance.find({
      schoolId,
      date: today,
    });

    const report = students.map((student) => {
      const record = attendanceRecords.find(
        (r) => r.studentId.toString() === student._id.toString()
      );
      return {
        id: student._id,
        name: student.fullName,
        class: student.class || "Unknown",
        gender: student.gender || "-",
        status: record ? record.status : "pending",
        timestamp: record ? record.timestamp : null,
      };
    });

    // Calc (Short for calculation) stuff
    const totalStudents = students.length;
    const receivedCount = attendanceRecords.filter(
      (r) => r.status === "received"
    ).length;
    const pendingCount = totalStudents - receivedCount;

    res.status(200).json({
      date: today,
      stats: {
        total: totalStudents,
        received: receivedCount,
        pending: pendingCount,
      },
      students: report,
    });
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
