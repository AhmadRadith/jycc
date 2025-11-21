import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";

import Statistic from "@/models/Statistic";
import StudentAttendance from "@/models/StudentAttendance";

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

  const User = (await import("@/models/User")).User;
  const user = await User.findById(session.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const schoolId = user.schoolId || "school_001";

  const sekolahStats = await Statistic.findOne({
    type: "sekolah",
    identifier: schoolId,
  });

  const dailyReports = await Report.find({
    schoolId,
    reporterRole: { $in: ["sekolah", "admin_sekolah"] },
  }).sort({ createdAt: -1 });

  const studentReports = await Report.find({
    schoolId,
    reporterRole: "murid",
  }).sort({ createdAt: -1 });

  const stats = sekolahStats
    ? sekolahStats.data
    : {
        totalStudents: 450,
        mealsDistributed: 0,
        attendanceRate: 0,
        studentFeedbackScore: 0,
      };

  const students = await User.find({ role: "murid", schoolId });
  const totalStudentsCount = students.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const presentCount = await StudentAttendance.countDocuments({
    schoolId,
    date: today,
    status: "received",
  });

  res.status(200).json({
    stats,
    reports: dailyReports, 
    dailyReports,
    studentReports,
    students,
    presentCount,
    profile: {
      name: user.fullName,
      province: user.district || "Jawa Timur",
      totalMurid: totalStudentsCount || stats.totalStudents || 450,
      address: user.address || "Alamat belum diisi",
      email: user.email,
      npsn: user.schoolId,
    },
  });
}
