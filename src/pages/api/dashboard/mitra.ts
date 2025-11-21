import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";

import Statistic from "@/models/Statistic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const mitraName = (req.query.mitraName as string) || "CV Mitra Sejahtera";

  const mitraStats = await Statistic.findOne({
    type: "mitra",
    identifier: mitraName,
  });

  const assignedReports = await Report.find({ assignedMitra: mitraName }).sort({
    createdAt: -1,
  });

  const stats = mitraStats
    ? mitraStats.data
    : {
        onTimeDelivery: 0,
        averageRating: 0,
        totalDeliveries: 0,
        activeComplaints: 0,
      };

  const finalStats = {
    ...stats,
    pendingIssues: assignedReports.filter(
      (r: any) => r.status === "pending" || r.status === "escalated"
    ).length,
  };

  res.status(200).json({
    stats: finalStats,
    reports: assignedReports,
  });
}
