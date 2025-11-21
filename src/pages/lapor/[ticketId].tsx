import React, { useState, useEffect, useMemo, useRef } from "react";
import type { GetServerSideProps } from "next";
import {
  MessageSquare,
  CheckCircle2,
  FileText,
  Users,
  Building2,
  GraduationCap,
  Send,
  Bot,
  Paperclip,
  Clock,
  ArrowRightCircle,
  Lock,
  Eye,
  X,
  Image as ImageIcon,
  Plus,
  Trash2,
  PenTool,
  RotateCcw,
  Eraser,
  Check,
} from "lucide-react";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";

//canvas
const useSignatureCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
      setIsEmpty(true);
    };

    resizeCanvas();
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setIsEmpty(false);
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const getSignatureData = () => {
    return canvasRef.current?.toDataURL("image/png") || null;
  };

  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ) => {
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
  };

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    getSignatureData,
    isEmpty,
  };
};

const SignatureModal = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signatureData: string) => void;
  actionType: string;
}) => {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    getSignatureData,
    isEmpty,
  } = useSignatureCanvas();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <PenTool size={16} className="text-blue-600" />
            Konfirmasi {actionType}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 bg-slate-100">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-48 touch-none cursor-crosshair block"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Mohon tanda tangan di atas untuk memverifikasi tindakan ini.
          </p>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Eraser size={14} /> Bersihkan
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => {
                const sig = getSignatureData();
                if (sig) onConfirm(sig);
              }}
              disabled={isEmpty}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MitraSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  currentMitraList,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mitraName: string) => void;
  currentMitraList: string[];
}) => {
  const [mitras, setMitras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/users/mitra")
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setMitras(data.mitras);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const filteredMitras = mitras.filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) &&
      !currentMitraList.includes(m.fullName)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            Pilih Mitra
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Cari mitra..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />

          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              <p className="text-center text-gray-400 text-sm py-4">
                Memuat data...
              </p>
            ) : filteredMitras.length > 0 ? (
              filteredMitras.map((mitra) => (
                <button
                  key={mitra._id}
                  onClick={() => onSelect(mitra.fullName)}
                  className="w-full text-left p-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group"
                >
                  <div className="font-bold text-gray-800 text-sm group-hover:text-blue-700">
                    {mitra.fullName}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{mitra.district}</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">
                Tidak ada mitra ditemukan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// tyipee
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
  studentReports: StudentReport[];
}

interface Comment {
  _id?: string;
  id?: number | string;
  author: string;
  role: string;
  time: string;
  message: string;
  type?:
    | "text"
    | "image"
    | "signature"
    | "system"
    | "escalation"
    | "status_change"
    | "rejection"
    | "approval";
  attachment?: string; // base 64 rets
  attachments?: File[]; //
  signature?: string; // F
  actionType?: string;
}

interface StudentReport {
  id: string;
  studentName: string;
  summary: string;
  time: number; // Timestamp
}

// Ai sementara? (Apus aja nnti)
const generateAIAdvice = (
  role: string,
  ticketStatus: string,
  ticketData: TicketData,
  comments: Comment[],
  studentReports: StudentReport[],
  currentMitraList: string[]
) => {
  const mitraStr = currentMitraList.join(", ");
  const isEscalated = ticketStatus === "escalated";
  const isResolved = ticketStatus === "resolved";
  const isRejected = ticketStatus === "rejected";

  // 1. Kasih konteks
  let summary = `Tiket status '${ticketStatus.toUpperCase()}' di ${
    ticketData.schoolName
  }. `;
  if (isEscalated) {
    summary += "KASUS DIESKALASI. Memerlukan atensi MBG Pusat. ";
  } else if (isResolved) {
    summary += "KASUS TELAH DISETUJUI/SELESAI. ";
  } else if (isRejected) {
    summary += "KASUS DITOLAK. ";
  } else {
    summary += "Masih dalam penanganan level Daerah. ";
  }
  summary += `Isu utama: ${ticketData.title}.`;

  // 2. Kasih info
  const insights = [
    `Kategori: ${ticketData.category}.`,
    `Prioritas: ${ticketData.priority.toUpperCase()}.`,
  ];

  if (ticketData.studentReports && ticketData.studentReports.length > 0) {
    insights.push(
      `Terdapat ${ticketData.studentReports.length} laporan siswa terkait.`
    );
  }

  if (isEscalated) {
    insights.push(
      "STATUS ESKALASI: Daerah memerlukan intervensi Pusat/Kebijakan."
    );
  } else if (!isResolved && !isRejected) {
    insights.push(`Menunggu verifikasi dengan ${mitraStr || "Mitra"}.`);
  }

  let guidance = "";
  let nextSteps: string[] = [];
  let draftReply = "";
  let statusAdvice = "";

  switch (role) {
    case "pusat":
      if (!isEscalated) {
        guidance = "TIKET BELUM DIESKALASI. Anda berada dalam mode MONITORING.";
        nextSteps = [
          "Pantau perkembangan investigasi Daerah.",
          "Intervensi hanya jika waktu penyelesaian > 48 jam.",
        ];
        draftReply = "";
        statusAdvice = "Menunggu Eskalasi dari Daerah.";
      } else {
        guidance =
          "TIKET DIESKALASI. Daerah meminta bantuan. Silakan berikan arahan.";
        nextSteps = [
          "Review bukti foto dan laporan siswa.",
          "Berikan instruksi kepada Daerah.",
        ];
        draftReply =
          "Terima laporan eskalasi. Kami akan segera meninjau dan memberikan instruksi lebih lanjut.";
        statusAdvice = "Kasus dalam penanganan Pusat.";
      }
      break;

    case "daerah":
      guidance = isEscalated
        ? "Tiket telah dieskalasi. Tunggu arahan MBG Pusat."
        : "Investigasi lapangan. Gunakan tombol aksi di bawah untuk mengambil keputusan.";
      nextSteps = isEscalated
        ? ["Monitor arahan dari Pusat."]
        : [
            "Hubungi PIC Mitra untuk klarifikasi.",
            "Klik ESCALATE jika butuh bantuan Pusat.",
            "Klik APPROVE jika isu selesai.",
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
      ];
      draftReply = "Kondisi lapangan saat ini sedang kami pantau.";
      statusAdvice = "Menunggu proses helpdesk.";
      break;

    default:
      guidance = "Pilih peran.";
  }

  return { summary, insights, guidance, nextSteps, draftReply, statusAdvice };
};

// Komponen laen

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

interface ApiComment {
  _id: string;
  author: string;
  role: string;
  time: string;
  message: string;
  type: string;
  attachment?: string;
}

const ManageStudentReportsModal = ({
  currentReports,
  onClose,
  onSave,
}: {
  currentReports: StudentReport[];
  onClose: () => void;
  onSave: (selectedIds: string[]) => void;
}) => {
  const [availableReports, setAvailableReports] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    currentReports.map((r) => r.id || (r as any)._id || "")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/dashboard/sekolah");
        const data = await res.json();
        if (data.studentReports) {
          setAvailableReports(data.studentReports);
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-900">
            Kelola Laporan Siswa
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat...</div>
          ) : availableReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada laporan siswa tersedia.
            </div>
          ) : (
            <div className="space-y-2">
              {availableReports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => toggleSelection(report._id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all flex items-start gap-3 ${
                    selectedIds.includes(report._id)
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                      selectedIds.includes(report._id)
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedIds.includes(report._id) && <Check size={14} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {report.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {report.reporterId} •{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(selectedIds)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TicketDetailPage({ ticketId }: TicketDetailPageProps) {
  const [currentRole, setCurrentRole] = useState("pusat");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentRole(data.user.role);
        }
      });
  }, []);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [ticketStatus, setTicketStatus] = useState("pending");
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const [assignedMitra, setAssignedMitra] = useState<string[]>([]);
  const [isManageReportsModalOpen, setIsManageReportsModalOpen] =
    useState(false);

  // Fetch Ticket Data
  useEffect(() => {
    if (ticketId) {
      fetch(`/api/lapor/${ticketId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
            return;
          }
          setTicket(data);
          setTicketStatus(data.status);
          setAssignedMitra(data.assignedMitra || []);

          //  Commentsnya dibua?
          const mappedComments = (data.comments || []).map((c: ApiComment) => ({
            id: c._id,
            author: c.author,
            role: c.role,
            time: new Date(c.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            message: c.message,
            type: c.type,
            signature:
              c.type === "signature" || c.type === "status_change"
                ? c.attachment
                : undefined,
            attachment: c.attachment,
            actionType:
              c.type === "status_change" ||
              c.type === "escalation" ||
              c.type === "rejection" ||
              c.type === "approval"
                ? c.message.split(":")[0] || "ACTION"
                : undefined,
          }));
          setComments(mappedComments);
        })
        .catch((err) => console.error("Error fetching ticket:", err));
    }
  }, [ticketId]);

  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [isMitraModalOpen, setIsMitraModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayedTicketId = ticketId || "";

  const canContribute = useMemo(() => {
    if (currentRole === "sekolah") return true;
    if (currentRole === "daerah") return true;
    if (currentRole === "pusat") return ticketStatus === "escalated";
    return false;
  }, [currentRole, ticketStatus]);

  const advice = useMemo(() => {
    if (!ticket) {
      return {
        summary: "",
        insights: [],
        guidance: "",
        nextSteps: [],
        draftReply: "",
        statusAdvice: "",
      };
    }
    return generateAIAdvice(
      currentRole,
      ticketStatus,
      ticket,
      comments,
      ticket.studentReports || [],
      assignedMitra
    );
  }, [currentRole, ticketStatus, comments, assignedMitra, ticket]);

  useEffect(() => {
    setIsThinking(true);
    const timer = setTimeout(() => setIsThinking(false), 600);
    return () => clearTimeout(timer);
  }, [currentRole, ticketStatus]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    let attachmentBase64 = "";
    let type: "text" | "image" = "text";

    if (selectedFile) {
      type = "image";
      attachmentBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
    }

    const newMsg = {
      author:
        currentRole === "daerah"
          ? "Admin Daerah"
          : currentRole === "pusat"
          ? "MBG Pusat"
          : currentRole === "sekolah"
          ? "Sekolah"
          : currentRole, // ID => predetermined title, wow
      role: currentRole,
      message: inputMessage,
      type: type,
      attachment: attachmentBase64,
    };

    const optimisticMsg: Comment = {
      id: Date.now(),
      ...newMsg,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      attachments: selectedFile ? [selectedFile] : [],
    };
    setComments([...comments, optimisticMsg]);
    setInputMessage("");
    handleRemoveFile();

    try {
      await fetch(`/api/lapor/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newMsg }),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // --- Modal aksi and smth ---
  const triggerAction = (action: string) => {
    setPendingAction(action);
    setIsSigModalOpen(true);
  };

  const handleSignatureConfirmed = async (signatureData: string) => {
    if (!pendingAction) return;

    let newStatus = ticketStatus;
    let sysMsg = "";
    let actionType = "";

    if (pendingAction === "Escalate") {
      newStatus = "escalated";
      sysMsg = "Tiket dieskalasi ke MBG Pusat.";
      actionType = "escalation";
    } else if (pendingAction === "Approve") {
      newStatus = "resolved";
      sysMsg = "Tiket disetujui dan diselesaikan.";
      actionType = "approval";
    } else if (pendingAction === "Reject") {
      newStatus = "rejected";
      sysMsg = "Tiket ditolak.";
      actionType = "rejection";
    }

    setTicketStatus(newStatus);

    const newComment = {
      author: currentRole === "daerah" ? "Admin Daerah" : "System",
      role: currentRole,
      message: `Tindakan: ${pendingAction.toUpperCase()} - ${sysMsg}`,
      type: "status_change" as const, // Using generic status_change or specific type (should fix the weird role kek e)
      attachment: signatureData,
    };

    const optimisticComment: Comment = {
      id: Date.now(),
      ...newComment,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      actionType: pendingAction.toUpperCase(),
      signature: signatureData,
    };

    setComments([...comments, optimisticComment]);
    setIsSigModalOpen(false);
    setPendingAction(null);

    try {
      await fetch(`/api/lapor/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, comment: newComment }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddMitra = () => {
    setIsMitraModalOpen(true);
  };

  const handleSelectMitra = async (mitraName: string) => {
    const newMitraList = [...assignedMitra, mitraName];
    setAssignedMitra(newMitraList);
    setIsMitraModalOpen(false);

    try {
      await fetch(`/api/lapor/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedMitra: newMitraList }),
      });
    } catch (error) {
      console.error("Error updating mitra:", error);
    }
  };

  const handleRemoveMitra = (index: number) => {
    const confirm = window.confirm("Hapus mitra ini dari tiket?");
    if (confirm) {
      const newList = [...assignedMitra];
      newList.splice(index, 1);
      setAssignedMitra(newList);
    }
  };

  const handleSaveReports = async (selectedIds: string[]) => {
    try {
      const res = await fetch("/api/dashboard/sekolah");
      const data = await res.json();
      if (data.studentReports) {
        const allReports: StudentReport[] = data.studentReports;
        const selectedReports = allReports.filter((r) =>
          selectedIds.includes(r.id || (r as any)._id)
        );

        await fetch(`/api/lapor/${ticketId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentReports: selectedReports }),
        });

        if (ticket) {
          setTicket({ ...ticket, studentReports: selectedReports });
        }
        setIsManageReportsModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving reports:", error);
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

  if (!ticket) {
    return (
      <MbgSidebarLayout activeMenu="lapor" role={currentRole}>
        <div className="p-8 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Memuat data tiket...</p>
        </div>
      </MbgSidebarLayout>
    );
  }

  return (
    <MbgSidebarLayout
      activeMenu="lapor"
      contentClassName="min-h-screen bg-[#f7f5f0]"
      role={currentRole}
    >
      <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
        <SignatureModal
          isOpen={isSigModalOpen}
          onClose={() => setIsSigModalOpen(false)}
          onConfirm={handleSignatureConfirmed}
          actionType={pendingAction || "Action"}
        />

        <MitraSelectionModal
          isOpen={isMitraModalOpen}
          onClose={() => setIsMitraModalOpen(false)}
          onSelect={handleSelectMitra}
          currentMitraList={assignedMitra}
        />

        {isManageReportsModalOpen && (
          <ManageStudentReportsModal
            currentReports={ticket?.studentReports || []}
            onClose={() => setIsManageReportsModalOpen(false)}
            onSave={handleSaveReports}
          />
        )}

        {/* <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Tiket</h1>
            <p className="text-gray-500 text-sm">
              {displayedTicketId} - {ticket!.schoolName}
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {["pusat", "daerah", "sekolah"].map((role) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all flex items-center gap-2 ${
                  currentRole === role
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {currentRole === role && (
                  <CheckCircle2 size={14} className="text-blue-500" />
                )}
                {role}
              </button>
            ))}
          </div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                  Informasi Tiket
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Judul
                  </span>
                  <p className="font-semibold text-gray-800 leading-snug mt-1 text-sm">
                    {ticket!.title}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Nomor Tiket
                  </span>
                  <p className="font-semibold text-gray-700 mt-1 font-mono tracking-wide text-sm">
                    {displayedTicketId}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Prioritas
                  </span>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        ticket.priority === "high"
                          ? "bg-orange-50 text-orange-700 border-orange-100"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {ticket!.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Sekolah
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                    <Building2 size={14} className="text-gray-400" />{" "}
                    {ticket!.schoolName}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Status
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        ticketStatus === "escalated"
                          ? "bg-red-100 text-red-800 border-red-200 animate-pulse"
                          : ticketStatus === "resolved"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : ticketStatus === "rejected"
                          ? "bg-gray-100 text-gray-800 border-gray-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }`}
                    >
                      {ticketStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Mitra
                    </span>
                    <button
                      onClick={handleAddMitra}
                      className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 hover:bg-blue-100 flex items-center gap-0.5"
                      title="Tambah Mitra"
                    >
                      <Plus size={10} /> Add
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {assignedMitra.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">
                        Belum ada mitra
                      </p>
                    ) : (
                      assignedMitra.map((m, idx) => (
                        <div
                          key={idx}
                          className="group relative text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-1.5 rounded border border-blue-100 flex justify-between items-center"
                        >
                          <span className="truncate max-w-[120px]">{m}</span>
                          <button
                            onClick={() => handleRemoveMitra(idx)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
                  Laporan Murid
                </h2>
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {ticket?.studentReports?.length || 0}
                  </span>
                  {currentRole === "sekolah" && (
                    <button
                      onClick={() => setIsManageReportsModalOpen(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <PenTool size={12} /> Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="p-3 bg-gray-50/30">
                {(ticket?.studentReports || []).length > 0 ? (
                  (ticket?.studentReports || []).map((report, idx) => (
                    <StudentReportCard key={report.id || idx} report={report} />
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-2">
                    Tidak ada laporan siswa terlampir.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2 text-xs uppercase tracking-wide">
                <MessageSquare size={14} /> Diskusi &amp; Eskalasi
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
              <div className="relative pl-4 border-l-2 border-gray-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-200 rounded-full border-2 border-white"></div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">
                    SYSTEM
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(ticket?.created || Date.now()).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-700">
                  <p className="mb-2 font-medium text-gray-900">Tiket Dibuat</p>
                  <p>{ticket!.description}</p>
                  {ticket?.attachments && ticket.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ticket.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100 w-fit"
                        >
                          <ImageIcon size={14} className="text-gray-400" />
                          <span className="text-xs text-blue-600 underline cursor-pointer">
                            {file.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {comments.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === currentRole
                      ? "items-end"
                      : msg.role === "system" || msg.actionType
                      ? "items-center"
                      : "items-start"
                  }`}
                >
                  {msg.role === "system" || msg.actionType ? (
                    <div className="flex flex-col items-center w-full my-4">
                      <div className="bg-gray-100 border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-full font-medium shadow-sm flex items-center gap-2">
                        {msg.actionType === "ESCALATE" && (
                          <ArrowRightCircle
                            size={14}
                            className="text-orange-500"
                          />
                        )}
                        {msg.actionType === "APPROVE" && (
                          <CheckCircle2 size={14} className="text-green-500" />
                        )}
                        {msg.actionType === "REJECT" && (
                          <X size={14} className="text-red-500" />
                        )}
                        {msg.message}
                      </div>
                      {msg.signature && (
                        <div className="mt-2 bg-white p-2 rounded border border-gray-200 shadow-sm flex flex-col items-center">
                          <img
                            src={msg.signature}
                            alt="Signature"
                            className="h-16 w-auto opacity-90"
                          />
                          <span className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">
                            Verified Signature
                          </span>
                        </div>
                      )}
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

            <div
              className={`p-4 bg-white border-t border-gray-100 relative ${
                !canContribute ? "min-h-[160px]" : ""
              }`}
            >
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

              <div className="relative flex items-end gap-2">
                {selectedFile && (
                  <div className="absolute bottom-full left-0 mb-2 z-20">
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

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canContribute}
                  className="mb-1.5 text-gray-400 hover:text-blue-600 p-2.5 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-blue-100"
                  title="Upload Foto"
                >
                  <Paperclip size={20} />
                </button>

                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ketik pesan sebagai ${currentRole.toUpperCase()}...`}
                  disabled={!canContribute}
                  className="flex-1 border border-gray-200 bg-gray-50 text-gray-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all shadow-sm h-[52px] focus:h-24 disabled:opacity-50 focus:bg-white"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={
                    (!inputMessage.trim() && !selectedFile) || !canContribute
                  }
                  className="mb-1.5 bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col">
            <div
              className={`bg-white rounded-xl shadow-lg border-t-4 ${
                getThemeColor().split(" ")[0]
              } overflow-hidden flex flex-col h-full`}
            >
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

              <div
                className={`p-5 space-y-6 flex-1 overflow-y-auto transition-opacity duration-300 ${
                  isThinking ? "opacity-50" : "opacity-100"
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={12} /> Ringkasan Situasi
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {advice.summary}
                  </p>
                </div>

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

              {currentRole !== "sekolah" && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  {currentRole === "daerah" ? (
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => triggerAction("Approve")}
                        className="flex flex-col items-center justify-center p-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all group"
                      >
                        <span className="text-xs font-bold text-green-700 mb-1">
                          APPROVE
                        </span>
                      </button>
                      <button
                        onClick={() => triggerAction("Reject")}
                        className="flex flex-col items-center justify-center p-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all group"
                      >
                        <span className="text-xs font-bold text-red-700 mb-1">
                          REJECT
                        </span>
                      </button>
                      <button
                        onClick={() => triggerAction("Escalate")}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </MbgSidebarLayout>
  );
}

export const getServerSideProps: GetServerSideProps<
  TicketDetailPageProps
> = async ({ params }) => {
  const rawTicketId = params?.ticketId;
  const resolvedTicketId = Array.isArray(rawTicketId)
    ? rawTicketId[0] ?? ""
    : rawTicketId ?? "";

  return {
    props: {
      ticketId: resolvedTicketId,
    },
  };
};
