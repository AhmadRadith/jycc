import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";
import Statistic from "@/models/Statistic";
import FoodItem from "@/models/FoodItem";
import SchoolRequest from "@/models/SchoolRequest";
import { MenuSchedule } from "@/models/MenuSchedule";
import Polling from "@/models/Polling";
import { User } from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const mitraName = (req.query.mitraName as string) || "CV Mitra Sejahtera";

  if (req.method === "POST") {
    try {
      const { action } = req.body;

      if (action === "add_food") {
        const { name, calories, protein, carbs, fat } = req.body;
        const newFood = await FoodItem.create({
          name,
          calories,
          protein,
          carbs,
          fat,
          mitraId: mitraName,
        });
        return res.status(201).json({ ok: true, food: newFood });
      }

      if (action === "delete_food") {
        const { id } = req.body;
        await FoodItem.findByIdAndDelete(id);
        return res.status(200).json({ ok: true });
      }

      if (action === "assign_menu") {
        const { date, menuId } = req.body;

        const schedule = await MenuSchedule.findOneAndUpdate(
          { date, mitraId: mitraName },
          { menuId },
          { upsert: true, new: true }
        ).populate("menuId");

        return res.status(200).json({ ok: true, schedule });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to process request" });
    }
  }

  const mitraStats = await Statistic.findOne({
    type: "mitra",
    identifier: mitraName,
  });

  const assignedReports = await Report.find({ assignedMitra: mitraName }).sort({
    createdAt: -1,
  });

  let schoolRequests = await SchoolRequest.find({ mitraId: mitraName }).sort({
    requestDate: 1,
  });

  const foodItems = await FoodItem.find({ mitraId: mitraName }).sort({
    createdAt: -1,
  });

  const menuSchedules = await MenuSchedule.find({
    mitraId: mitraName,
  }).populate("menuId");

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
    weeklyScores: stats.weeklyScores || [
      { name: "W1", score: 8.5 },
      { name: "W2", score: 8.2 },
      { name: "W3", score: 8.8 },
      { name: "W4", score: 9.0 },
    ],
  };

  const pollings = await Polling.find({
    suggestion: { $exists: true, $ne: "" },
  })
    .sort({ createdAt: -1 })
    .populate("studentId", "fullName class");

  const suggestionsMap = new Map<string, any[]>();
  const schoolIds = new Set<string>();

  pollings.forEach((p) => {
    if (!suggestionsMap.has(p.schoolId)) {
      suggestionsMap.set(p.schoolId, []);
      schoolIds.add(p.schoolId);
    }
    suggestionsMap.get(p.schoolId)?.push({
      id: p._id,
      studentName: p.studentId?.fullName || "Siswa",
      studentClass: p.studentId?.class || "-",
      suggestion: p.suggestion,
      date: p.createdAt,
      menuChoice: p.menuChoice,
    });
  });

  const schools = await User.find({
    schoolId: { $in: Array.from(schoolIds) },
    role: "sekolah",
  }).select("schoolId fullName");

  const schoolNameMap = new Map<string, string>();
  schools.forEach((s) => {
    if (s.schoolId) schoolNameMap.set(s.schoolId, s.fullName);
  });

  const suggestionsBySchool = Array.from(suggestionsMap.entries()).map(
    ([schoolId, items]) => ({
      schoolId,
      schoolName: schoolNameMap.get(schoolId) || `Sekolah ${schoolId}`,
      items,
    })
  );

  res.status(200).json({
    stats: finalStats,
    reports: assignedReports,
    requests: schoolRequests,
    foodItems: foodItems,
    menuSchedules: menuSchedules,
    suggestions: suggestionsBySchool,
  });
}
