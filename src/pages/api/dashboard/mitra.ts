import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";
import Statistic from "@/models/Statistic";
import FoodItem from "@/models/FoodItem";
import SchoolRequest from "@/models/SchoolRequest";
import { MenuSchedule } from "@/models/MenuSchedule";

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

  if (schoolRequests.length === 0) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const seedRequests = [
      {
        schoolName: "SDN 1 Banyuwangi",
        menuName: "Nasi Goreng Spesial",
        quantity: 450,
        requestDate: today,
        status: "pending",
        mitraId: mitraName,
      },
      {
        schoolName: "SMPN 2 Genteng",
        menuName: "Ayam Bakar Madu",
        quantity: 320,
        requestDate: today,
        status: "approved",
        mitraId: mitraName,
      },
      {
        schoolName: "SMA 1 Glagah",
        menuName: "Soto Ayam",
        quantity: 500,
        requestDate: tomorrow,
        status: "pending",
        mitraId: mitraName,
      },
    ];
    await SchoolRequest.insertMany(seedRequests);
    schoolRequests = await SchoolRequest.find({ mitraId: mitraName }).sort({
      requestDate: 1,
    });
  }

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
  };

  res.status(200).json({
    stats: finalStats,
    reports: assignedReports,
    requests: schoolRequests,
    foodItems: foodItems,
    menuSchedules: menuSchedules,
  });
}
