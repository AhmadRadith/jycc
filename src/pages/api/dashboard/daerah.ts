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

  const districtParam =
    (req.query.district as string) || process.env.DEFAULT_DISTRICT || "";

  const reportFilter: Record<string, any> = {};
  if (districtParam) {
    reportFilter.district = districtParam;
  }

  const daerahStats = districtParam
    ? await Statistic.findOne({
        type: "daerah",
        identifier: districtParam,
      })
    : await Statistic.findOne({
        type: "daerah",
        identifier: "Jawa Timur",
      });

  const recentReports = await Report.find(reportFilter)
    .sort({ createdAt: -1 })
    .limit(5);

  const stats = daerahStats
    ? daerahStats.data
    : {
        totalReports: await Report.countDocuments(reportFilter),
        pendingReports: await Report.countDocuments({
          ...reportFilter,
          status: "pending",
        }),
        distributionRate: 0,
        activeSchools: 0,
        totalStudents: 0,
        reportedIssues: 0,
      };

  const alerts =
    recentReports.map((r: any, idx: number) => ({
      id: idx + 1,
      ticketId: r._id,
      type:
        r.priority === "high"
          ? "danger"
          : r.priority === "medium"
          ? "warning"
          : "info",
      title: r.title,
      location: r.schoolName || r.schoolId || r.district || "Tidak diketahui",
      time: r.createdAt,
      desc: r.description,
    })) ?? [];

  const schoolFilter: Record<string, any> = { role: "sekolah" };
  if (districtParam) {
    schoolFilter.district = districtParam;
  }

  const schools = await User.find(schoolFilter);

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

  const finalStats = {
    ...stats,
    totalReports: await Report.countDocuments(reportFilter),
    pendingReports: await Report.countDocuments({
      ...reportFilter,
      status: "pending",
    }), 
    pendingReportsThisWeek: await Report.countDocuments({
      ...reportFilter,
      status: "pending",
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    activeSchools: schools.length,
    totalStudents: schoolData.reduce((acc, curr) => acc + curr.students, 0),
  };

  res.status(200).json({
    stats: finalStats,
    recentReports,
    alerts,
    schools: schoolData,
  });
}
