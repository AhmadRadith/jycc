import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongo";
import { Report } from "@/models/Report";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    role,
    ticket,
    comments,
    studentReports,
    assignedMitra,
    ticketId,
    forceRefresh,
  } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API Key" });
  }

  await dbConnect();

  try {
    if (ticketId && !forceRefresh) {
      const existingReport = await Report.findById(ticketId);
      if (
        existingReport &&
        existingReport.aiAnalysis &&
        existingReport.aiAnalysis.summary
      ) {
        return res.status(200).json(existingReport.aiAnalysis);
      }
    }

    const prompt = `
      Anda adalah asisten cerdas untuk helpdesk program MBG (Makan Bergizi Gratis).
      Analisis tiket berikut dan berikan saran untuk pengguna dengan peran: ${role}.

      Judul Tiket: ${ticket.title}
      Deskripsi: ${ticket.description}
      Kategori: ${ticket.category}
      Status: ${ticket.status}
      Prioritas: ${ticket.priority}
      Sekolah: ${ticket.schoolName}
      Mitra Bertugas: ${assignedMitra ? assignedMitra.join(", ") : "Tidak ada"}

      Komentar/Diskusi:
      ${
        comments
          ? comments
              .map((c: any) => `- [${c.role}] ${c.author}: ${c.message}`)
              .join("\n")
          : "Tidak ada komentar"
      }

      Laporan Siswa:
      ${
        studentReports
          ? studentReports
              .map((r: any) => `- ${r.studentName}: ${r.summary}`)
              .join("\n")
          : "Tidak ada laporan siswa"
      }

      Kembalikan objek JSON dengan field berikut (jangan gunakan format markdown seperti \`\`\`json):
      {
        "summary": "Ringkasan singkat situasi (maksimal 2 kalimat).",
        "insights": ["Insight 1", "Insight 2"],
        "guidance": "Rekomendasi spesifik untuk peran ${role}.",
        "nextSteps": ["Langkah 1", "Langkah 2"],
        "draftReply": "Draft balasan yang sopan dan profesional untuk dikirim pengguna (opsional, string kosong jika tidak perlu).",
        "statusAdvice": "Saran singkat tentang perubahan status (misal: 'Eskalasi ke Pusat', 'Tandai Selesai', atau 'Tunggu respon')."
      }
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    const jsonAdvice = JSON.parse(generatedText);

    // Save to database if ticketId is present
    if (ticketId) {
      await Report.findByIdAndUpdate(ticketId, {
        $set: {
          aiAnalysis: {
            ...jsonAdvice,
            lastUpdated: new Date(),
          },
        },
      });
    }

    res.status(200).json(jsonAdvice);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate advice" });
  }
}
