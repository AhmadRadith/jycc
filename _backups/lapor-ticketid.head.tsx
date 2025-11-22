import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  FileText,
  Users,
  Building2,
  GraduationCap,
  Send,
  Bot,
  ChevronRight,
  Paperclip,
  Clock,
  ShieldAlert,
  ArrowRightCircle,
  Lock,
  Eye,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Utensils,
  XCircle,
} from "lucide-react";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";
import { generateAIAdvice } from "@/data/lapor-data";
import {
  Ticket,
  TicketComment,
  UserRole,
  TicketStatus,
} from "@/shared/lapor-types";

const RoleBadge = ({ role }: { role: UserRole }) => {
  const colors: Record<UserRole, string> = {
    pusat: "bg-purple-100 text-purple-800",
    daerah: "bg-blue-100 text-blue-800",
    sekolah: "bg-green-100 text-green-800",
    system: "bg-gray-200 text-gray-600",
    murid: "bg-orange-100 text-orange-800",
    mitra: "bg-teal-100 text-teal-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
        colors[role] || colors.system
      }`}
    >
      {role}
    </span>
  );
};

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const styles: Record<TicketStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    escalated: "bg-red-100 text-red-800 border-red-200 animate-pulse",
    resolved: "bg-green-100 text-green-800 border-green-200",
    open: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
        styles[status] || styles.pending
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
};

export default function TicketDetailPage() {
  const router = useRouter();
  const { ticketId } = router.query;

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [detailRole, setDetailRole] = useState<UserRole>("daerah");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role) {
          setDetailRole(data.user.role);
        }
      });
  }, []);
  const [detailComments, setDetailComments] = useState<TicketComment[]>([]);
  const [detailInput, setDetailInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ticketId) {
      const fetchTicket = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/lapor/${ticketId}`);
          if (res.ok) {
            const data = await res.json();
            setActiveTicket(data);
            setDetailComments(data.comments || []);
          } else {
            console.error("Ticket not found");
            setActiveTicket(null);
          }
        } catch (error) {
          console.error("Error fetching ticket:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTicket();
    }
  }, [ticketId]);

  const handleSendMessage = async () => {
    if (!detailInput.trim() || !activeTicket) return;

    const newMsg = {
      author:
        detailRole === "daerah"
          ? "Admin Daerah"
          : detailRole === "pusat"
          ? "MBG Pusat"
          : "Sekolah",
      role: detailRole,
      message: detailInput,
      time: new Date(),
    };

    try {
      const res = await fetch(`/api/lapor/${activeTicket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newMsg }),
      });

      if (res.ok) {
        const updatedTicket = await res.json();

        const optimisticMsg: TicketComment = {
          id: Date.now(),
          author: newMsg.author,
          role: newMsg.role,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          message: newMsg.message,
        };

        setDetailComments([...detailComments, optimisticMsg]);
        setDetailInput("");
      } else {
        alert("Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleEscalate = async () => {
    if (window.confirm("Eskalasi tiket ini ke Pusat?")) {
      try {
        const res = await fetch(`/api/lapor/${activeTicket?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "escalated",
            comment: {
              author: "SYSTEM",
              role: "system",
              message: "Tiket dieskalasi ke MBG Pusat.",
            },
          }),
        });

        if (res.ok) {
          const sysMsg: TicketComment = {
            id: Date.now(),
            author: "SYSTEM",
            role: "system",
            time: "Now",
            message: "Tiket dieskalasi ke MBG Pusat.",
          };

          if (activeTicket) {
            setActiveTicket({
              ...activeTicket,
              status: "escalated",
            });
          }
          setDetailComments([...detailComments, sysMsg]);
        } else {
          alert("Gagal mengeskalasi tiket");
        }
      } catch (error) {
        console.error("Error escalating ticket:", error);
        alert("Terjadi kesalahan");
      }
    }
  };

  const hasAccess = useMemo(() => {
    if (!activeTicket) return true;
    if (
      detailRole === "sekolah" &&
      activeTicket.schoolName !== "SMPN 3 Bandung"
    ) {
      return false;
    }
    return true;
  }, [activeTicket, detailRole]);

  if (loading) {
    return (
      <MbgSidebarLayout activeMenu="lapor">
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <p className="text-gray-500">Loading ticket...</p>
        </div>
      </MbgSidebarLayout>
    );
  }

  if (!activeTicket) {
    return (
      <MbgSidebarLayout activeMenu="lapor">
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Ticket not found.</p>
        </div>
      </MbgSidebarLayout>
    );
  }

  if (!hasAccess) {
    return (
      <MbgSidebarLayout activeMenu="lapor">
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          <ShieldAlert size={48} className="text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Akses Ditolak</h1>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Sebagai <strong>Sekolah</strong>, Anda tidak memiliki izin untuk
            melihat tiket dari sekolah lain ({activeTicket?.schoolName}).
          </p>
          <button
            onClick={() => setDetailRole("daerah")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Kembali ke View As Daerah
          </button>
        </div>
      </MbgSidebarLayout>
    );
  }

  const advice = generateAIAdvice(
    detailRole,
    activeTicket.status as TicketStatus,
    activeTicket,
    activeTicket.studentReports
  );

  const canContribute =
    detailRole === "sekolah" ||
    detailRole === "daerah" ||
    (detailRole === "pusat" && activeTicket.status === "escalated");

  return (
    <MbgSidebarLayout activeMenu="lapor">
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/lapor")}
            className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Kembali ke Daftar
          </button>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">
                    {activeTicket.title}
                  </h1>
                  <StatusBadge status={activeTicket.status} />
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Building2 size={14} /> {activeTicket.schoolName}
                  <span className="text-gray-300">|</span>
                  ID: {activeTicket.id}
                </p>
              </div>

              {/* <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <span className="text-xs text-gray-500 px-2 font-medium">
                  View As:
                </span>
                {(["pusat", "daerah", "sekolah"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => setDetailRole(role)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                      detailRole === role
                        ? "bg-white shadow-sm text-blue-700 ring-1 ring-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-200px)] min-h-[600px]">
              <div className="lg:col-span-3 border-r border-gray-200 bg-gray-50 p-4 space-y-6 overflow-y-auto">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Mitra Bertugas
                  </label>
                  <div className="bg-white p-2 rounded border border-gray-200 text-sm font-medium text-blue-800 flex items-center gap-2">
                    <Utensils size={14} /> {activeTicket.assignedMitra[0]}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Deskripsi
                  </label>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 leading-relaxed">
                    {activeTicket.description}
                  </p>
                </div>
                {activeTicket.studentReports?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        Laporan Murid
                      </label>
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 rounded-full">
                        {activeTicket.studentReports.length}
                      </span>
                    </div>
                    {activeTicket.studentReports.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white p-2 rounded border border-gray-200 text-sm shadow-sm"
                      >
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span className="font-bold">{r.studentName}</span>
                          <span>{r.time}</span>
                        </div>
                        <p className="text-gray-700 italic">
                          &ldquo;{r.summary}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 flex flex-col bg-white">
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                  {detailComments.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.role === detailRole
                          ? "items-end"
                          : msg.role === "system"
                          ? "items-center"
                          : "items-start"
                      }`}
                    >
                      {msg.role === "system" ? (
                        <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                          {msg.message}
                        </span>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-600">
                              {msg.author}
                            </span>
                            <RoleBadge role={msg.role} />
                          </div>
                          <div
                            className={`p-3 rounded-2xl text-sm max-w-[90%] shadow-sm ${
                              msg.role === detailRole
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="relative">
                    {!canContribute && (
                      <div className="absolute inset-0 bg-gray-50/90 z-10 flex items-center justify-center text-gray-500 text-sm font-medium">
                        <Lock size={16} className="mr-2" /> Mode View-Only
                        (Belum Dieskalasi)
                      </div>
                    )}
                    <textarea
                      value={detailInput}
                      onChange={(e) => setDetailInput(e.target.value)}
                      placeholder={`Balas sebagai ${detailRole}...`}
                      className="w-full border border-gray-300 rounded-lg pl-3 pr-12 py-2 text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 resize-none h-20 disabled:bg-gray-100 disabled:text-gray-400"
                      disabled={!canContribute}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!canContribute || !detailInput.trim()}
                      className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 border-l border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center gap-3">
                  <div className="bg-white p-1.5 rounded shadow-sm border border-blue-100">
                    <Bot size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">
                      AI Assistant
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      Context-Aware Helpdesk
                    </p>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-900">
                    <p className="font-medium mb-1 flex items-center gap-2">
                      <FileText size={14} /> Ringkasan
                    </p>
                    {advice.summary}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                      <Users size={12} /> Panduan: {detailRole}
                    </h4>
                    <ul className="space-y-2">
                      {advice.nextSteps.map((step, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-gray-700"
                        >
                          <span className="bg-gray-100 text-gray-500 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {advice.draftReply && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                        Draft Balasan
                      </h4>
                      <div
                        className="bg-gray-800 text-gray-200 p-3 rounded text-sm italic cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={() => setDetailInput(advice.draftReply)}
                      >
                        &ldquo;{advice.draftReply}&rdquo;
                      </div>
                    </div>
                  )}
                </div>
                {detailRole === "daerah" && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={handleEscalate}
                      disabled={activeTicket.status === "escalated"}
                      className="w-full py-2 bg-gray-800 text-white text-xs font-bold rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {activeTicket.status === "escalated"
                        ? "SUDAH DIESKALASI"
                        : "ESCALATE TO PUSAT"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MbgSidebarLayout>
  );
}
