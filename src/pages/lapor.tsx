import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Plus,
  Search,
  Filter,
  XCircle,
  CheckCircle2,
  GraduationCap,
  Utensils,
  ChevronRight,
  ArrowLeft,
  Send,
  AlertCircle,
} from "lucide-react";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";

import {
  Ticket,
  TicketStatus,
  UserRole,
  TicketComment,
  StudentReport,
} from "@/shared/lapor-types";
import { GetServerSideProps } from "next";
import { getSessionUserFromCookies } from "@/lib/session";
import { Camera, SwitchCamera, Trash2, X } from "lucide-react";

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

interface TicketLaporPageProps {
  user: {
    username: string;
    role: UserRole;
    schoolId?: string;
    fullName?: string;
  } | null;
}

import { CameraCapture } from "@/components/CameraCapture";

export default function TicketLaporPage({ user }: TicketLaporPageProps) {
  const router = useRouter();
  const [view, setView] = useState<"list" | "create">("list");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentRole, setCurrentRole] = useState<UserRole>(
    user?.role || "daerah"
  );

  useEffect(() => {
    if (currentRole === "murid") {
      setView("create");
    }
  }, [currentRole]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "Operasional",
    description: "",
    priority: "medium",
    mitra: "",
    selectedReportIds: [] as string[],
  });

  const [mitraList, setMitraList] = useState<string[]>([]);
  const [availableStudentReports, setAvailableStudentReports] = useState<any[]>(
    []
  );

  useEffect(() => {
    const fetchMitras = async () => {
      try {
        const res = await fetch("/api/users/mitra");
        if (res.ok) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.mitras)) {
            setMitraList(data.mitras.map((m: any) => m.fullName));
          }
        }
      } catch (error) {
        console.error("Error fetching mitra list:", error);
      }
    };

    fetchMitras();

    const fetchStudentReports = async () => {
      try {
        const res = await fetch("/api/dashboard/sekolah");
        if (res.ok) {
          const data = await res.json();
          if (data.studentReports) {
            setAvailableStudentReports(data.studentReports);
          }
        }
      } catch (error) {
        console.error("Error fetching student reports:", error);
      }
    };
    if (currentRole === "sekolah") {
      fetchStudentReports();
    }
  }, [currentRole]);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("role", currentRole);

        if (currentRole === "sekolah") {
          params.append("schoolName", user?.fullName || "Sekolah");
        } else if (currentRole === "murid") {
          params.append("userId", user?.username || "murid");
        } else if (currentRole === "mitra") {
          const mitraName =
            user?.role === "mitra"
              ? user.fullName
              : mitraList[0] || "Mitra Nusantara Sehat";
          params.append("userId", mitraName || "Mitra Nusantara Sehat");
        }

        if (statusFilter !== "all") params.append("status", statusFilter);
        if (categoryFilter !== "all") params.append("category", categoryFilter);
        if (priorityFilter !== "all") params.append("priority", priorityFilter);
        if (searchTerm) params.append("search", searchTerm);

        const res = await fetch(`/api/lapor?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        } else {
          console.error("Failed to fetch tickets");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [
    currentRole,
    statusFilter,
    categoryFilter,
    priorityFilter,
    searchTerm,
    mitraList,
    user,
  ]);

  const uniqueSchools = useMemo(() => {
    const schools = new Set(tickets.map((t) => t.schoolName));
    return Array.from(schools);
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSchool =
        schoolFilter === "all" || ticket.schoolName === schoolFilter;

      return matchesSchool;
    });
  }, [tickets, schoolFilter]);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ticketPayload = {
      title: newTicket.title,
      category: newTicket.category,
      description: newTicket.description,
      priority: newTicket.priority,
      assignedMitra: [newTicket.mitra],
      schoolName: user?.fullName || "Sekolah",
      reporterId: user?.username || "sekolah_user_id",
      reporterRole: user?.role || "sekolah",
      status: "pending",
      studentReports: newTicket.selectedReportIds.map((id) => {
        const report = availableStudentReports.find((r) => r._id === id);
        return {
          studentName: report?.reporterId || "Siswa",
          summary: report?.title || "Laporan Siswa",
          time: new Date(report?.createdAt).getTime(),
          attachment: report?.image,
        };
      }),
    };

    try {
      const res = await fetch("/api/lapor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketPayload),
      });

      if (res.ok) {
        const savedTicket = await res.json();
        const mappedTicket: Ticket = {
          id: savedTicket._id,
          title: savedTicket.title,
          schoolName: savedTicket.schoolName,
          category: savedTicket.category,
          status: savedTicket.status,
          priority: savedTicket.priority,
          created: savedTicket.createdAt,
          description: savedTicket.description,
          assignedMitra: savedTicket.assignedMitra,
          comments: [],
          studentReports: [],
        };
        setTickets([mappedTicket, ...tickets]);
        setView("list");
        setNewTicket({
          title: "",
          category: "Operasional",
          description: "",
          priority: "medium",
          mitra: "",
          selectedReportIds: [],
        });
      } else {
        alert("Gagal membuat tiket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Terjadi kesalahan");
    }
  };

  const renderTicketList = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Daftar Tiket {currentRole === "sekolah" ? "Sekolah" : "Laporan"}
          </h1>
          <p className="text-gray-500">Pantau dan laporkan isu layanan MBG</p>
        </div>

        <div className="flex items-center gap-3">
          {/* <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-lg mr-4">
            <span className="text-xs text-gray-500 px-2 font-medium">
              View As:
            </span>
            {(
              ["pusat", "daerah", "sekolah", "mitra", "murid"] as UserRole[]
            ).map((role) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                  currentRole === role
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {role}
              </button>
            ))}
          </div> */}

          <button
            onClick={() => setView("create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <Plus size={18} /> Buat Tiket Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <div className="flex items-center p-4 border-b border-gray-100 gap-3 bg-gray-50">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan judul, ID, atau sekolah..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle size={14} />
              </button>
            )}
          </div>

          {currentRole !== "sekolah" && (
            <div className="relative">
              <button
                onClick={() => setShowSchoolMenu(!showSchoolMenu)}
                className={`p-2 border rounded-lg hover:bg-white transition-colors flex items-center gap-2 ${
                  showSchoolMenu || schoolFilter !== "all"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-gray-300 text-gray-600 bg-white"
                }`}
              >
                <GraduationCap size={18} />
                {schoolFilter !== "all" && (
                  <span className="text-xs font-bold max-w-[100px] truncate">
                    {schoolFilter}
                  </span>
                )}
              </button>

              {showSchoolMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSchoolMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-100 mb-1">
                      Filter Sekolah
                    </div>
                    <button
                      onClick={() => {
                        setSchoolFilter("all");
                        setShowSchoolMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                        schoolFilter === "all"
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-700"
                      }`}
                    >
                      <span>Semua Sekolah</span>
                      {schoolFilter === "all" && <CheckCircle2 size={14} />}
                    </button>
                    {uniqueSchools.map((school) => (
                      <button
                        key={school}
                        onClick={() => {
                          setSchoolFilter(school);
                          setShowSchoolMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                          schoolFilter === school
                            ? "text-blue-600 font-medium bg-blue-50"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="truncate">{school}</span>
                        {schoolFilter === school && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className={`p-2 border rounded-lg hover:bg-white transition-colors flex items-center gap-2 ${
                showCategoryMenu || categoryFilter !== "all"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-300 text-gray-600 bg-white"
              }`}
            >
              <Utensils size={18} />
              {categoryFilter !== "all" && (
                <span className="text-xs font-bold max-w-[100px] truncate">
                  {categoryFilter}
                </span>
              )}
            </button>

            {showCategoryMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCategoryMenu(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-100 mb-1">
                    Filter Kategori
                  </div>
                  {[
                    "all",
                    "Kualitas Makanan",
                    "Operasional",
                    "Logistik",
                    "Kebersihan",
                    "Lainnya",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setShowCategoryMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                        categoryFilter === cat
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{cat === "all" ? "Semua Kategori" : cat}</span>
                      {categoryFilter === cat && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className={`p-2 border rounded-lg hover:bg-white transition-colors flex items-center gap-2 ${
                showPriorityMenu || priorityFilter !== "all"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-300 text-gray-600 bg-white"
              }`}
            >
              <AlertCircle size={18} />
              {priorityFilter !== "all" && (
                <span className="text-xs font-bold uppercase">
                  {priorityFilter}
                </span>
              )}
            </button>

            {showPriorityMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowPriorityMenu(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-100 mb-1">
                    Filter Prioritas
                  </div>
                  {["all", "low", "medium", "high"].map((prio) => (
                    <button
                      key={prio}
                      onClick={() => {
                        setPriorityFilter(prio);
                        setShowPriorityMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                        priorityFilter === prio
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="capitalize">
                        {prio === "all" ? "Semua" : prio}
                      </span>
                      {priorityFilter === prio && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2 border rounded-lg hover:bg-white transition-colors flex items-center gap-2 ${
                showFilterMenu || statusFilter !== "all"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-300 text-gray-600 bg-white"
              }`}
            >
              <Filter size={18} />
              {statusFilter !== "all" && (
                <span className="text-xs font-bold uppercase">
                  {statusFilter}
                </span>
              )}
            </button>

            {showFilterMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterMenu(false)}
                ></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-100 mb-1">
                    Filter Status
                  </div>
                  {["all", "pending", "escalated", "resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                        statusFilter === status
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="capitalize">{status}</span>
                      {statusFilter === status && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Memuat tiket...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3">ID & Judul</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Laporan Siswa</th>
                <th className="px-6 py-3">Mitra</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-gray-500 mb-0.5">
                        {ticket.id.substring(0, 8)}...
                      </span>
                      <span className="font-medium text-gray-900 group-hover:text-blue-700">
                        {ticket.title}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(ticket.created).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ticket.category}
                  </td>
                  <td className="px-6 py-4">
                    {ticket.studentReports?.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                        <GraduationCap size={12} />
                        {ticket.studentReports.length} Laporan
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs px-2">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 inline-flex items-center gap-1">
                      <Utensils size={10} />
                      {ticket.assignedMitra[0] || "Unassigned"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => router.push(`/lapor/${ticket.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1"
                    >
                      Detail <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredTickets.length === 0 && (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="font-medium">Tidak ada tiket ditemukan.</p>
            <p className="text-sm mt-1">
              {currentRole === "sekolah"
                ? "Anda belum membuat tiket laporan."
                : "Coba ubah kata kunci pencarian atau filter status."}
            </p>
            {(statusFilter !== "all" || searchTerm) && (
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                }}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderCreateTicket = () => (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => setView("list")}
        className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Kembali ke Daftar
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-blue-600 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus size={24} className="bg-blue-500 p-1 rounded" /> Buat Tiket
            Laporan
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Laporkan isu layanan atau kualitas makanan kepada MBG Daerah.
          </p>
        </div>

        <form onSubmit={handleCreateSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Judul Laporan
              </label>
              <input
                required
                type="text"
                value={newTicket.title}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, title: e.target.value })
                }
                placeholder="Contoh: Nasi terlalu lembek"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={newTicket.category}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option>Kualitas Makanan</option>
                <option>Operasional</option>
                <option>Logistik</option>
                <option>Kebersihan</option>
                <option>Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Deskripsi Masalah
            </label>
            <textarea
              required
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket({ ...newTicket, description: e.target.value })
              }
              rows={4}
              placeholder="Jelaskan detail masalah, lokasi, dan waktu kejadian..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Utensils size={16} className="text-blue-600" /> Pilih Mitra
              Bertanggung Jawab
            </label>
            <select
              required
              value={newTicket.mitra}
              onChange={(e) =>
                setNewTicket({ ...newTicket, mitra: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="" disabled>
                -- Pilih Mitra dari Daftar --
              </option>
              {mitraList.map((mitra) => (
                <option key={mitra} value={mitra}>
                  {mitra}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              * Wajib memilih mitra agar tiket diteruskan ke pihak yang tepat
            </p>
          </div>

          {currentRole === "sekolah" && availableStudentReports.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Lampirkan Laporan Siswa (Opsional)
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                {availableStudentReports.map((report) => (
                  <div
                    key={report._id}
                    className={`p-3 border-b border-gray-100 flex items-start gap-3 cursor-pointer transition-colors ${
                      newTicket.selectedReportIds.includes(report._id)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      const selected = newTicket.selectedReportIds.includes(
                        report._id
                      );
                      setNewTicket({
                        ...newTicket,
                        selectedReportIds: selected
                          ? newTicket.selectedReportIds.filter(
                              (id) => id !== report._id
                            )
                          : [...newTicket.selectedReportIds, report._id],
                      });
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${
                        newTicket.selectedReportIds.includes(report._id)
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {newTicket.selectedReportIds.includes(report._id) && (
                        <CheckCircle2 size={14} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {report.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {report.reporterId} •{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pilih laporan siswa yang relevan dengan tiket ini.
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setView("list")}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!newTicket.mitra}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
            >
              <Send size={18} /> Kirim Tiket
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const StudentReportForm = ({ user }: { user: any }) => {
    const [form, setForm] = useState({
      title: "",
      description: "",
      image: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const payload = {
          title: form.title,
          description: form.description,
          image: form.image,
          category: "Laporan Siswa",
          priority: "medium",
          reporterId: user?.username || "murid",
          reporterRole: "murid",
          schoolId: user?.schoolId,
          status: "pending",
        };

        const res = await fetch("/api/lapor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          alert("Laporan berhasil dikirim!");
          setForm({ title: "", description: "", image: "" });
        } else {
          alert("Gagal mengirim laporan.");
        }
      } catch (error) {
        console.error("Error submitting report:", error);
        alert("Terjadi kesalahan.");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {showCamera && (
          <CameraCapture
            onCapture={(img) => {
              setForm({ ...form, image: img });
              setShowCamera(false);
            }}
            onClose={() => setShowCamera(false)}
          />
        )}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Lapor Masalah Makan Siang</h2>
          <p className="text-blue-100 text-sm">
            Ada masalah dengan makananmu? Foto dan laporkan di sini!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Judul Laporan
            </label>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Nasi basi, ada rambut, dll."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-gray-900 placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Ceritakan Masalahnya
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Jelaskan apa yang terjadi..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none bg-white text-gray-900 placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Foto Bukti (Wajib)
            </label>
            <div className="relative">
              {form.image ? (
                <div className="relative h-48 rounded-xl overflow-hidden border-2 border-blue-500 bg-gray-100">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50"
                >
                  <Camera size={48} className="text-gray-600 mb-2" />
                  <span className="text-sm text-gray-700 font-bold">
                    Tap untuk ambil foto
                  </span>
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !form.image}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            {submitting ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </form>
      </div>
    );
  };

  return (
    <MbgSidebarLayout
      activeMenu="lapor"
      contentClassName="min-h-screen bg-[#f7f5f0]"
      role={currentRole}
    >
      <div className="w-full font-sans text-gray-900 p-6 md:p-8">
        {currentRole === "murid" ? (
          <StudentReportForm user={user} />
        ) : (
          <>
            {view === "list" && renderTicketList()}
            {view === "create" && renderCreateTicket()}
          </>
        )}
      </div>
    </MbgSidebarLayout>
  );
}

import dbConnect from "@/lib/mongo";
import { User } from "@/models/User";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionUser = getSessionUserFromCookies(context.req.headers.cookie);

  if (!sessionUser) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  await dbConnect();
  const userDoc = await User.findById(sessionUser.id);

  const user = {
    username: sessionUser.username,
    role: sessionUser.role,
    fullName: userDoc?.fullName || sessionUser.username,
    schoolId: userDoc?.schoolId || null,
  };

  return {
    props: {
      user,
    },
  };
};
