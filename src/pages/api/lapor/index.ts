import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

import { getSessionUserFromRequest } from "@/lib/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { role, schoolName, status, search } = req.query;

      let query: any = {};

      if (role === "sekolah") {
        const session = getSessionUserFromRequest(req);
        if (session && session.role === "sekolah") {
          const User = (await import("@/models/User")).User;
          const user = await User.findById(session.id);
          if (user && user.schoolId) {
            query.schoolId = user.schoolId;
          } else if (schoolName) {
            query.schoolName = schoolName;
          }
        } else if (schoolName) {
          query.schoolName = schoolName;
        }
      } else if (role === "murid") {
        const { userId } = req.query;
        if (userId) {
          query.reporterId = userId;
        }
      } else if (role === "mitra") {
        const { userId } = req.query;
        if (userId) {
          query.assignedMitra = userId;
        }
      } else if (role === "pusat") {
        query.status = { $in: ["escalated", "resolved", "rejected"] };
      }

      if (status && status !== "all") {
        query.status = status;
      }

      if (search) {
        const searchRegex = { $regex: search, $options: "i" };
        query.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { schoolName: searchRegex },
          { category: searchRegex },
        ];
      }

      const reports = await Report.find(query).sort({ createdAt: -1 });

      const tickets = reports.map((report) => ({
        id: report._id.toString(),
        title: report.title,
        schoolName: report.schoolName || "Sekolah",
        category: report.category,
        status: report.status,
        priority: report.priority,
        created: report.createdAt,
        description: report.description,
        assignedMitra: report.assignedMitra,
        comments: report.comments,
        studentReports: report.studentReports || [],
      }));

      res.status(200).json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  } else if (req.method === "POST") {
    try {
      const newTicket = await Report.create(req.body);
      res.status(201).json(newTicket);
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ error: "Failed to create ticket" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
