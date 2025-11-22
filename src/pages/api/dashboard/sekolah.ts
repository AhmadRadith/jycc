import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";

import Statistic from "@/models/Statistic";
import StudentAttendance from "@/models/StudentAttendance";

import { getSessionUserFromRequest } from "@/lib/session";

import defLocale from "../../../locales/api.json"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const session = getSessionUserFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: defLocale.UNAUTHORIZED });
  }

  const User = (await import("@/models/User")).User;
  const user = await User.findById(session.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (req.method === "DELETE") {
    const { studentId } = req.query;
    if (!studentId)
      return res.status(400).json({ error: "Student ID required" });

    await User.findByIdAndDelete(studentId);
    await StudentAttendance.deleteMany({ studentId });

    return res.status(200).json({ message: "Student deleted" });
  }

  if (req.method === "PUT") {
    const { id, name, nisn, className, gender } = req.body;
    if (!id) return res.status(400).json({ error: "Student ID required" });

    await User.findByIdAndUpdate(id, {
      fullName: name,
      username: nisn,
      class: className,
      gender: gender,
    });

    return res.status(200).json({ message: "Student updated" });
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

  const attendanceRecords = await StudentAttendance.find({
    schoolId,
    date: today,
    status: "received",
  });

  const attendanceMap = new Set(attendanceRecords.map((r) => r.studentId));

  const studentsWithStatus = students.map((s) => ({
    _id: s._id,
    fullName: s.fullName,
    username: s.username,
    class: s.class,
    gender: s.gender,
    status: attendanceMap.has(s._id.toString()) ? "Sudah menerima" : "-",
  }));

  const presentCount = attendanceRecords.length;

  res.status(200).json({
    stats,
    reports: dailyReports,
    dailyReports,
    studentReports,
    students: studentsWithStatus,
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
