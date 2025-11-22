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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const { ticketId } = req.query;

  if (req.method === "GET") {
    try {
      let report;
      try {
        report = await Report.findById(ticketId);
      } catch (e) {
        report = null;
      }

      if (!report) {
        return res.status(404).json({ error: "Ticket not found" });
      }

      const ticket = {
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
      };

      res.status(200).json(ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  } else if (req.method === "PUT") {
    try {
      const { status, comment, assignedMitra } = req.body;
      const updateData: any = {};

      if (status) updateData.status = status;
      if (assignedMitra) updateData.assignedMitra = assignedMitra;
      if (req.body.priority) updateData.priority = req.body.priority;
      if (req.body.studentReports)
        updateData.studentReports = req.body.studentReports;

      if (comment) {
        const report = await Report.findByIdAndUpdate(
          ticketId,
          {
            $set: updateData,
            $push: { comments: comment },
          },
          { new: true }
        );
        return res.status(200).json(report);
      } else {
        const report = await Report.findByIdAndUpdate(
          ticketId,
          { $set: updateData },
          { new: true }
        );
        return res.status(200).json(report);
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({ error: "Failed to update ticket" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
