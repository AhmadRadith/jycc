import React, { useState, useEffect, useMemo, useRef } from "react";
import type { GetServerSideProps } from "next";
import {
  MessageSquare,
  CheckCircle2,
  FileText,
  Users,
  GraduationCap,
  Clock,
  Building2,
  Paperclip,
  Send,
  Bot,
  ArrowRightCircle,
  Lock,
  Eye,
  X,
  Image as ImageIcon,
  LayoutDashboard,
  BarChart3,
  Bell,
} from "lucide-react";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";

// --- MOCK DATA ---
const MOCK_TICKET_DATA = {
  id: "TKT-001",
  title: "Contoh Laporan Masalah",
  schoolName: "Sekolah Contoh",
  category: "Operasional",
  status: "pending", // Initial status
  priority: "high",
  created: "2023-11-15T09:00:00+07:00",
  description: "Deskripsi masalah yang dilaporkan oleh sekolah.",
  attachments: [{ name: "foto_bukti.jpg", type: "image/jpeg" }],
  assignedMitra: ["Mitra Contoh"],
};

const MOCK_COMMENTS = [
  {
    id: 1,
    author: "Sekolah",
    role: "sekolah",
    time: "2023-11-15 09:05",
    message:
      "Mohon bantuan untuk meninjau alur antrian makan siang, banyak siswa terlambat masuk kelas.",
    attachments: [],
  },
  {
    id: 2,
    author: "Admin Daerah",
    role: "daerah",
    time: "2023-11-15 09:30",
    message:
      "Terima kasih atas laporannya. Kami akan koordinasi dengan mitra terkait dan meminta dokumentasi tambahan.",
    attachments: [],
  },
];

const MOCK_STUDENT_REPORTS = [
  {
    id: "LAP-001",
    studentName: "Ani - Kelas 7A",
    summary:
      "Antrian makan siang cukup panjang, beberapa siswa hampir terlambat masuk kelas.",
    time: new Date("2023-11-15T10:45:00").getTime(),
  },
  {
    id: "LAP-002",
    studentName: "Budi - Kelas 8B",
    summary: "Porsi lauk di meja 3 menipis lebih cepat dibanding meja lainnya.",
    time: new Date("2023-11-15T11:05:00").getTime(),
  },
];

// --- TYPES ---
interface TicketData {
  id: string;
  title: string;
  schoolName: string;
  category: string;
  status: string;
  priority: string;
  created: string;
  description: string;
  attachments: { name: string; type: string }[];
  assignedMitra: string[];
}

interface Comment {
  id: number;
  author: string;
  role: string;
  time: string;
  message: string;
  attachments?: File[];
}

interface StudentReport {
  id: string;
  studentName: string;
  summary: string;
  time: number;
}

// --- AI LOGIC ENGINE ---
const generateAIAdvice = (
  role: string,
  ticketStatus: string,
  ticketData: TicketData,
  comments: Comment[],
  studentReports: StudentReport[]
) => {
  const assignedMitra = ticketData.assignedMitra.join(", ");
  const isEscalated = ticketStatus === "escalated";

  // 1. Context Summary
  let summary = `Tiket status '${ticketStatus.toUpperCase()}' di ${
    ticketData.schoolName
  }. `;
  if (isEscalated) {
    summary += "KASUS DIESKALASI. Memerlukan atensi MBG Pusat. ";
  } else {
    summary += "Masih dalam penanganan level Daerah. ";
  }
  summary += `Isu utama: ${ticketData.title}.`;

  // 2. Insights
  const insights = [
    `Kategori: ${ticketData.category}.`,
    `Prioritas: ${ticketData.priority.toUpperCase()}.`,
  ];

  if (studentReports && studentReports.length > 0) {
    insights.push(`Terdapat ${studentReports.length} laporan siswa terkait.`);
  }

  if (isEscalated) {
    insights.push(
      "STATUS ESKALASI: Daerah memerlukan intervensi Pusat/Kebijakan."
    );
  } else {
    insights.push(`Menunggu verifikasi dengan ${assignedMitra || "Mitra"}.`);
  }

  // 3. Role-Specific Guidance
  let guidance = "";
  let nextSteps: string[] = [];
  let draftReply = "";
  let statusAdvice = "";

  switch (role) {
    case "pusat":
      if (!isEscalated) {
        guidance =
          "TIKET BELUM DIESKALASI. Anda berada dalam mode MONITORING. Biarkan Daerah menangani kecuali ada pelanggaran berat.";
        nextSteps = [
          "Pantau perkembangan investigasi Daerah.",
          "Tunggu notifikasi Eskalasi jika Daerah tidak sanggup menangani.",
          "Intervensi hanya jika waktu penyelesaian > 48 jam.",
        ];
        draftReply = ""; // No reply allowed
        statusAdvice = "Menunggu Eskalasi dari Daerah.";
      } else {
        guidance =
          "TIKET DIESKALASI. Daerah meminta bantuan. Silakan berikan arahan kebijakan atau sanksi Mitra.";
        nextSteps = [
          "Review bukti foto dan laporan siswa.",
          "Berikan instruksi kepada Daerah untuk penyesuaian SOP Mitra.",
          "Pastikan solusi diterapkan dalam 24 jam ke depan.",
        ];
        draftReply =
          "Terima laporan eskalasi. Kami akan segera meninjau dan memberikan instruksi lebih lanjut.";
        statusAdvice = "Kasus dalam penanganan Pusat.";
      }
      break;

    case "daerah":
      guidance = isEscalated
        ? "Tiket telah dieskalasi. Tunggu arahan MBG Pusat sebelum tindakan lebih lanjut."
        : "Investigasi lapangan. Jika Mitra tidak kooperatif atau butuh kebijakan baru, silakan Eskalasi.";
      nextSteps = isEscalated
        ? [
            "Monitor arahan dari Pusat.",
            "Pastikan Mitra siap implementasi arahan baru.",
          ]
        : [
            "Hubungi PIC Mitra untuk klarifikasi Meja 3.",
            "Minta foto bukti terbaru dari Sekolah.",
            "Klik ESCALATE jika butuh bantuan Pusat.",
          ];
      draftReply = isEscalated
        ? "Mohon arahan Pusat terkait langkah selanjutnya."
        : "Kami sedang mendalami laporan ini dengan Mitra. Mohon Sekolah standby.";
      statusAdvice = "Wewenang status ada pada Anda.";
      break;

    case "sekolah":
      guidance =
        "Tetap berikan data lapangan (foto/laporan siswa) untuk membantu investigasi.";
      nextSteps = [
        "Unggah foto kondisi terbaru.",
        "Laporkan jika ada perubahan signifikan.",
        "Tunggu instruksi perbaikan alur.",
      ];
      draftReply = "Kondisi lapangan saat ini sedang kami pantau.";
      statusAdvice = "Menunggu proses helpdesk.";
      break;

    default:
      guidance = "Pilih peran.";
  }

  return { summary, insights, guidance, nextSteps, draftReply, statusAdvice };
};

// --- COMPONENTS ---

const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    pusat: "bg-purple-100 text-purple-800 border-purple-200",
    daerah: "bg-blue-100 text-blue-800 border-blue-200",
    sekolah: "bg-green-100 text-green-800 border-green-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
        styles[role.toLowerCase()] || "bg-gray-100 text-gray-800"
      }`}
    >
      {role}
    </span>
  );
};

const StudentReportCard = ({ report }: { report: StudentReport }) => (
  <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm mb-2 hover:border-blue-300 transition-colors cursor-default">
    <div className="flex justify-between items-start mb-1">
      <span className="font-medium text-gray-800 flex items-center gap-2 text-sm">
        <div className="bg-blue-100 p-1 rounded text-blue-600">
          <GraduationCap size={14} />
        </div>
        {report.studentName}
      </span>
      <span className="text-xs text-gray-400 flex items-center gap-1">
        <Clock size={10} />{" "}
        {new Date(report.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
    <div className="pl-8">
      <p className="text-gray-600 text-sm italic border-l-2 border-gray-100 pl-2">
        &ldquo;{report.summary}&rdquo;
      </p>
    </div>
  </div>
);

interface TicketDetailPageProps {
  ticketId?: string | null;
}

export default function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
  const [currentRole, setCurrentRole] = useState("pusat");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role) {
          setCurrentRole(data.user.role);
        }
      });
  }, []);
  const [ticketStatus, setTicketStatus] = useState(MOCK_TICKET_DATA.status);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayedTicketId =
    typeof ticketId === "string" && ticketId.trim().length > 0
      ? ticketId
      : MOCK_TICKET_DATA.id;

  const canContribute = useMemo(() => {
    if (currentRole === "sekolah") return true;
    if (currentRole === "daerah") return true;
    if (currentRole === "pusat") return ticketStatus === "escalated";
    return false;
  }, [currentRole, ticketStatus]);

  const advice = useMemo(
    () =>
      generateAIAdvice(
        currentRole,
        ticketStatus,
        MOCK_TICKET_DATA,
        comments,
        MOCK_STUDENT_REPORTS
      ),
    [currentRole, ticketStatus, comments]
  );

  useEffect(() => {
    setIsThinking(true);
    const timer = setTimeout(() => setIsThinking(false), 600);
    return () => clearTimeout(timer);
  }, [currentRole, ticketStatus]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Verify if it's an image
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        alert("Mohon hanya upload file foto/gambar (jpg, png, dll).");
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() && !selectedFile) return;
    const newMsg = {
      id: comments.length + 1,
      author:
        currentRole === "daerah"
          ? "Admin Daerah"
          : currentRole === "pusat"
          ? "MBG Pusat"
          : "Sekolah",
      role: currentRole,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: inputMessage,
      attachments: selectedFile ? [selectedFile] : [],
    };
    setComments([...comments, newMsg]);
    setInputMessage("");
    handleRemoveFile(); // Clear file after sending
  };

  const handleEscalate = () => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin mengeskalasi tiket ini ke Pusat?"
    );
    if (confirm) {
      setTicketStatus("escalated");
      // Add system message
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: "SYSTEM",
          role: "system",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          message: "Tiket dieskalasi ke MBG Pusat.",
        },
      ]);
    }
  };

  const copyDraft = () => {
    if (advice.draftReply) setInputMessage(advice.draftReply);
  };

  const getThemeColor = () => {
    switch (currentRole) {
      case "pusat":
        return "border-purple-500 text-purple-700";
      case "daerah":
        return "border-blue-500 text-blue-700";
      case "sekolah":
        return "border-green-500 text-green-700";
      default:
        return "border-gray-300 text-gray-600";
    }
  };

  return (
    <MbgSidebarLayout activeMenu="lapor" role={currentRole}>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
        {/* TOP NAVIGATION BAR */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="lg:hidden bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                <Building2 size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 leading-none">
                  MBG Helpdesk
                </h1>
                <span className="text-xs text-gray-500 font-mono">
                  {displayedTicketId} &bull;{" "}
                  {MOCK_TICKET_DATA.priority.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
              {["pusat", "daerah", "sekolah"].map((role) => (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all capitalize flex items-center gap-2 ${
                    currentRole === role
                      ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {currentRole === role && (
                    <CheckCircle2 size={14} className="text-blue-500" />
                  )}
                  {role}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Ticket Info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  Metadata Tiket
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    Judul
                  </span>
                  <p className="font-semibold text-gray-800 leading-snug mt-1">
                    {MOCK_TICKET_DATA.title}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    Nomor Tiket
                  </span>
                  <p className="font-semibold text-gray-700 mt-1 font-mono tracking-wide">
                    {displayedTicketId}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    Sekolah
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                    <Building2 size={16} className="text-gray-400" />{" "}
                    {MOCK_TICKET_DATA.schoolName}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    Status
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        ticketStatus === "escalated"
                          ? "bg-red-100 text-red-800 border-red-200 animate-pulse"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }`}
                    >
                      {ticketStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase">
                    Mitra
                  </span>
                  <p className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1.5 rounded border border-blue-100 mt-1 inline-block">
                    {MOCK_TICKET_DATA.assignedMitra[0]}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  Laporan Murid
                </h2>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {MOCK_STUDENT_REPORTS.length}
                </span>
              </div>
              <div className="p-3 bg-gray-50/30">
                {MOCK_STUDENT_REPORTS.map((report) => (
                  <StudentReportCard key={report.id} report={report} />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Chat (Expanded to col-span-6) */}
          <div className="lg:col-span-6 flex flex-col h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wide">
                <MessageSquare size={16} /> Diskusi &amp; Eskalasi
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
              <div className="relative pl-4 border-l-2 border-gray-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-200 rounded-full border-2 border-white"></div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">
                    SYSTEM
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {MOCK_TICKET_DATA.created.split("T")[1].slice(0, 5)}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
                  <p className="mb-2 font-medium text-gray-900">Tiket Dibuat</p>
                  <p>{MOCK_TICKET_DATA.description}</p>
                  {/* Mock attachment in initial ticket */}
                  <div className="mt-2 flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100 w-fit">
                    <ImageIcon size={14} className="text-gray-400" />
                    <span className="text-xs text-blue-600 underline cursor-pointer">
                      foto_antrian_1.jpg
                    </span>
                  </div>
                </div>
              </div>

              {comments.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === currentRole
                      ? "items-end"
                      : msg.role === "system"
                      ? "items-center"
                      : "items-start"
                  }`}
                >
                  {msg.role === "system" ? (
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full my-2 font-medium">
                      {msg.message}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span
                          className={`text-xs font-bold ${
                            msg.role === currentRole
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {msg.author}
                        </span>
                        <RoleBadge role={msg.role} />
                        <span className="text-[10px] text-gray-400">
                          {msg.time}
                        </span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-sm max-w-[90%] shadow-sm leading-relaxed ${
                          msg.role === currentRole
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                        }`}
                      >
                        {/* Display attachments if any */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mb-2 space-y-1">
                            {msg.attachments.map((file, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-2 p-2 rounded text-xs font-medium ${
                                  msg.role === currentRole
                                    ? "bg-blue-500 text-blue-50"
                                    : "bg-gray-50 text-gray-700 border border-gray-100"
                                }`}
                              >
                                <ImageIcon size={14} />
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {msg.message}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area (Conditional) */}
            <div className="p-4 bg-white border-t border-gray-100 relative">
              {!canContribute ? (
                <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center gap-2 max-w-xs">
                    <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                      <Eye size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">
                      Mode Monitoring
                    </h3>
                    <p className="text-xs text-gray-500">
                      Pusat hanya dapat berkontribusi setelah tiket{" "}
                      <span className="font-bold text-red-500">Dieskalasi</span>{" "}
                      oleh Daerah.
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="relative">
                {/* Attachment Preview (Pills) */}
                {selectedFile && (
                  <div className="absolute bottom-full left-0 mb-2">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 text-xs font-medium shadow-sm">
                      <ImageIcon size={14} />
                      <span className="max-w-[150px] truncate">
                        {selectedFile.name}
                      </span>
                      <button
                        onClick={handleRemoveFile}
                        className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ketik pesan sebagai ${currentRole.toUpperCase()}...`}
                  disabled={!canContribute}
                  className="w-full border border-gray-300 bg-white text-gray-900 rounded-xl pl-12 pr-12 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all shadow-sm h-24 disabled:opacity-50"
                />

                {/* ATTACHMENT BUTTON (LEFT) */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canContribute}
                  className="absolute bottom-3 left-3 text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload Foto"
                >
                  <Paperclip size={20} />
                </button>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*" // Only allows images
                  className="hidden"
                />

                {/* SEND BUTTON (RIGHT) */}
                <button
                  onClick={handleSendMessage}
                  disabled={
                    (!inputMessage.trim() && !selectedFile) || !canContribute
                  }
                  className="absolute bottom-3 right-3 bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: AI Assistant (Reduced to col-span-3) */}
          <div className="lg:col-span-3 flex flex-col">
            <div
              className={`bg-white rounded-xl shadow-lg border-t-4 ${
                getThemeColor().split(" ")[0]
              } overflow-hidden flex flex-col h-full`}
            >
              {/* AI Header */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-white shadow-sm border border-gray-100 ${
                        getThemeColor().split(" ")[1]
                      }`}
                    >
                      <Bot size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">
                        Smart Assistant
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        Powered by MBG Core
                      </p>
                    </div>
                  </div>
                  {isThinking && (
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Content */}
              <div
                className={`p-5 space-y-6 flex-1 overflow-y-auto transition-opacity duration-300 ${
                  isThinking ? "opacity-50" : "opacity-100"
                }`}
              >
                {/* 1. Situation Summary */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={12} /> Ringkasan Situasi
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {advice.summary}
                  </p>
                </div>

                {/* 2. Key Insights */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> Analisis Tiket
                  </h4>
                  <div className="space-y-2">
                    {advice.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="text-sm p-2.5 rounded border flex items-start gap-2.5 bg-white border-gray-100 shadow-sm"
                      >
                        <ArrowRightCircle
                          size={14}
                          className="text-blue-500 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-gray-700">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Role Guidance */}
                <div
                  className={`p-4 rounded-xl border ${
                    currentRole === "daerah"
                      ? "bg-blue-50 border-blue-100"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                      currentRole === "daerah"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    <Users size={12} /> Rekomendasi: {currentRole}
                  </h4>
                  <p className="text-sm text-gray-800 mb-4 font-medium">
                    {advice.guidance}
                  </p>

                  <div className="space-y-2">
                    {advice.nextSteps.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="font-bold text-gray-400 text-xs mt-0.5">
                          {i + 1}.
                        </span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Draft Reply */}
                {advice.draftReply && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Send size={12} /> Draft Balasan Cepat
                    </h4>
                    <div
                      onClick={copyDraft}
                      className="group relative bg-gray-800 hover:bg-gray-700 transition-all p-4 rounded-xl cursor-pointer shadow-lg"
                    >
                      <p className="text-gray-200 text-sm italic leading-relaxed">
                        &ldquo;{advice.draftReply}&rdquo;
                      </p>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                          CLICK TO COPY
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions (Daerah Only) */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                {currentRole === "daerah" ? (
                  <div className="grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center justify-center p-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all group">
                      <span className="text-xs font-bold text-green-700 mb-1">
                        APPROVE
                      </span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all group">
                      <span className="text-xs font-bold text-red-700 mb-1">
                        REJECT
                      </span>
                    </button>
                    <button
                      onClick={handleEscalate}
                      disabled={ticketStatus === "escalated"}
                      className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-all shadow-sm ${
                        ticketStatus === "escalated"
                          ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 border-gray-900 hover:bg-gray-700 text-white"
                      }`}
                    >
                      <span className="text-xs font-bold mb-1">ESCALATE</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-xs py-2 bg-gray-100 rounded-lg border border-gray-200 border-dashed">
                    <Lock size={12} />
                    <span>Menu aksi terkunci untuk peran {currentRole}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </MbgSidebarLayout>
  );
}
