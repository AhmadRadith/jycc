import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";
import { User } from "@/models/User";

import Statistic from "@/models/Statistic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const pusatStats = await Statistic.findOne({
    type: "pusat",
    identifier: "national",
  });

  const recentReports = await Report.find({}).sort({ createdAt: -1 }).limit(5);

  const stats = pusatStats
    ? pusatStats.data
    : {
        totalReports: await Report.countDocuments({}),
        pendingReports: await Report.countDocuments({ status: "pending" }),
        resolvedReports: await Report.countDocuments({ status: "approved" }),
        participationRate: 0,
        distributionData: [],
        weeklyScores: [
          { name: "W1", score: 0 },
          { name: "W2", score: 0 },
          { name: "W3", score: 0 },
          { name: "W4", score: 0 },
        ],
      };

  const alertReports = await Report.find({
    $or: [{ priority: "high" }, { status: "rejected" }],
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const alerts = alertReports.map((r) => ({
    id: r._id,
    title: r.title,
    desc: r.description,
    time: r.createdAt,
    type: r.priority === "high" ? "danger" : "warning",
    location: r.district || r.schoolName || "Unknown",
  }));

  const schools = await User.find({ role: "sekolah" });

  const schoolData = await Promise.all(
    schools.map(async (school) => {
      const studentCount = await User.countDocuments({
        role: "murid",
        schoolId: school.schoolId,
      });

      const totalSchoolReports = await Report.countDocuments({
        schoolId: school.schoolId,
      });
      const approvedSchoolReports = await Report.countDocuments({
        schoolId: school.schoolId,
        status: "approved",
      });

      const score =
        totalSchoolReports > 0
          ? Math.round((approvedSchoolReports / totalSchoolReports) * 100)
          : 100;

      return {
        id: school._id,
        name: school.fullName,
        students: studentCount,
        pic: school.username,
        score: score,
        email: school.email,
        npsn: school.schoolId,
        district: school.district || "Unknown",
      };
    })
  );

  res.status(200).json({
    stats,
    recentReports,
    alerts,
    schools: schoolData,
  });
}
