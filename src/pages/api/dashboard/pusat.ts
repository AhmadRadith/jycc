import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";

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

  res.status(200).json({
    stats,
    recentReports,
    alerts,
  });
}
