import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";
import { getSessionUserFromRequest } from "@/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();


  const session = getSessionUserFromRequest(req);
  const User = (await import("@/models/User")).User;
  const StudentAttendance = (await import("@/models/StudentAttendance"))
    .default;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const currentStudent = await User.findById(session.id);
  if (!currentStudent) {
    return res.status(404).json({ error: "Student not found" });
  }

  if (!currentStudent.schoolId) {
    return res.status(400).json({ error: "Student has no school assigned" });
  }

  const schoolId = currentStudent.schoolId;

  const recentReports = await Report.find({ schoolId })
    .sort({ createdAt: -1 })
    .limit(5);

  const schoolProfile = await User.findOne({ schoolId });

  let attendanceDone = false;
  if (currentStudent) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendance = await StudentAttendance.findOne({
      studentId: currentStudent._id,
      date: today,
    });
    if (attendance) attendanceDone = true;
  }

  res.status(200).json({
    studentId: currentStudent?._id,
    attendanceDone,
    menu: {
      date: new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      today: "Nasi Goreng + Telur",
      nutrition: {
        kalori: "450 kkal",
        protein: "20g",
        karbo: "60g",
        lemak: "15g",
      },
    },
    history: recentReports,
    school: {
      name: schoolProfile?.fullName || "Sekolah",
      province: schoolProfile?.district || "Jawa Timur",
    },
  });
}
