import {
  Ticket,
  TicketStatus,
  UserRole,
  Advice,
  StudentReport,
} from "@/shared/lapor-types";

export const generateAIAdvice = (
  role: UserRole,
  ticketStatus: TicketStatus,
  ticketData: Ticket,
  studentReports: StudentReport[]
): Advice => {
  const assignedMitra = ticketData.assignedMitra
    ? ticketData.assignedMitra.join(", ")
    : "-";
  const isEscalated = ticketStatus === "escalated";

  let summary = `Tiket '${ticketStatus.toUpperCase()}' di ${
    ticketData.schoolName
  }. `;
  if (isEscalated) summary += "KASUS DIESKALASI. ";
  else summary += "Penanganan level Daerah. ";
  summary += `Mitra: ${assignedMitra}.`;

  const insights: string[] = [
    `Prioritas: ${ticketData.priority.toUpperCase()}`,
    isEscalated
      ? "Status ESKALASI: Butuh intervensi Pusat."
      : "Menunggu proses di Daerah.",
    studentReports?.length > 0
      ? `${studentReports.length} Laporan Siswa terlampir.`
      : "Belum ada laporan siswa spesifik.",
  ];

  let guidance = "";
  let draftReply = "";
  let statusAdvice = "";
  let nextSteps: string[] = [];

  switch (role) {
    case "pusat":
      if (!isEscalated) {
        guidance = "Mode MONITORING. Anda tidak bisa intervensi status.";
        nextSteps = ["Pantau dashboard.", "Cek durasi penyelesaian tiket."];
        statusAdvice = "Menunggu eskalasi.";
      } else {
        guidance = "TIKET DIESKALASI. Silakan berikan keputusan/sanksi.";
        nextSteps = [
          "Review pelanggaran Mitra.",
          "Instruksikan Daerah.",
          "Update SOP jika perlu.",
        ];
        draftReply = "Pusat mengambil alih. Kami akan audit Mitra terkait.";
        statusAdvice = "Wewenang Pusat.";
      }
      break;
    case "daerah":
      guidance = isEscalated
        ? "Menunggu arahan Pusat."
        : "Investigasi & Koordinasi Mitra.";
      nextSteps = isEscalated
        ? ["Monitor instruksi Pusat."]
        : ["Hubungi Mitra.", "Verifikasi lapangan.", "Eskalasi jika buntu."];
      draftReply = "Kami sedang koordinasi dengan Mitra.";
      statusAdvice = "Dapat mengubah status.";
      break;
    case "sekolah":
      guidance = "Berikan data lapangan & bukti foto.";
      nextSteps = ["Upload foto terbaru.", "Kumpulkan laporan siswa."];
      draftReply = "Berikut bukti foto tambahan.";
      statusAdvice = "View only.";
      break;
    default:
      guidance = "Pilih peran.";
  }
  return { summary, insights, guidance, nextSteps, draftReply, statusAdvice };
};
