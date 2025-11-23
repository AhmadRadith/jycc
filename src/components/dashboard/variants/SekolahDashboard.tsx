import React, { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  MbgSidebarLayout,
  SidebarMenuKey,
} from "@/components/layouts/MbgSidebarLayout";
import {
  School,
  MapPin,
  Users,
  Utensils,
  CheckCircle,
  Calendar,
  Clock,
  ClipboardCheck,
  Bell,
  Info,
  Search,
  UserPlus,
  Send as Paperplane,
  History,
  FileText,
  Settings,
  LayoutDashboard,
  Download,
  Edit,
  Trash2,
  Filter,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Menu,
  X,
  Check,
  MoreHorizontal,
  AlertTriangle,
  Eye,
  Camera,
  Lock,
  Mail,
  Upload,
  FileSpreadsheet,
} from "lucide-react";

type ReportStatus = "approved" | "pending" | "rejected";

interface Student {
  id: string;
  name: string;
  nisn: string;
  class: string;
  status: string;
  gender: string;
}

const EditStudentModal = ({
  student,
  isOpen,
  onClose,
  onSave,
}: {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Student) => void;
}) => {
  const [formData, setFormData] = useState<Student | null>(null);

  useEffect(() => {
    setFormData(student);
  }, [student]);

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Edit Data Siswa
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NISN
            </label>
            <input
              type="text"
              value={formData.nisn}
              onChange={(e) =>
                setFormData({ ...formData, nisn: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kelas
            </label>
            <input
              type="text"
              value={formData.class}
              onChange={(e) =>
                setFormData({ ...formData, class: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

interface DailyReport {
  id: string;
  date: string;
  menu: string;
  totalStudents: number;
  distributed: number;
  status: ReportStatus;
  notes?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success" | "danger";
  read: boolean;
}

interface SchoolStats {
  mealsDistributed: number;
  attendanceRate: number;
}

interface DashboardReport {
  id: string;
  date: string;
  menu: string;
  totalStudents: number;
  distributed: number;
  status: ReportStatus;
  notes?: string;
}

interface ApiStudent {
  _id: string;
  fullName: string;
  username: string;
  class?: string;
  status?: "Hadir" | "Belum Hadir";
  gender?: "L" | "P";
}

interface ApiReport {
  _id: string;
  createdAt: string;
  title: string;
  totalStudents?: number;
  mealsDistributed?: number;
  status: ReportStatus;
  description?: string;
}

const DashboardHome = ({ data, loading }: { data: any; loading: boolean }) => {
  const [presentCount, setPresentCount] = useState(0);
  // const [loading, setLoading] = useState(true);
  const [schoolProfile, setSchoolProfile] = useState({
    name: "Loading...",
    province: "Loading...",
    totalMurid: 0,
  });
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [reports, setReports] = useState<DashboardReport[]>([]);

  useEffect(() => {
    if (data) {
      if (data.stats) setStats(data.stats);
      if (data.profile) setSchoolProfile(data.profile);
      if (data.reports) {
        const mappedReports: DashboardReport[] = data.reports.map(
          (r: ApiReport) => ({
            id: r._id,
            date: new Date(r.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            menu: r.title,
            totalStudents: r.totalStudents,
            distributed: r.mealsDistributed,
            status: r.status,
            notes: r.description,
          })
        );
        setReports(mappedReports);
      }

      if (typeof data.presentCount === "number") {
        setPresentCount(data.presentCount);
      } else if (data.students) {
        const present = data.students.filter(
          (s: any) => s.status === "Hadir"
        ).length;
        setPresentCount(present);
      }
    }
  }, [data]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("/api/dashboard/sekolah");
  //       const data = await res.json();
  //       if (data.stats) setStats(data.stats);
  //       if (data.profile) setSchoolProfile(data.profile);
  //       if (data.reports) {
  //         const mappedReports: DashboardReport[] = data.reports.map(
  //           (r: ApiReport) => ({
  //             id: r._id,
  //             date: new Date(r.createdAt).toLocaleDateString("id-ID", {
  //               day: "numeric",
  //               month: "long",
  //               year: "numeric",
  //             }),
  //             menu: r.title,
  //             totalStudents: r.totalStudents,
  //             distributed: r.mealsDistributed,
  //             status: r.status,
  //             notes: r.description,
  //           })
  //         );
  //         setReports(mappedReports);
  //       }

  //       if (typeof data.presentCount === "number") {
  //         setPresentCount(data.presentCount);
  //       } else if (data.students) {
  //         const present = data.students.filter(
  //           (s: any) => s.status === "Hadir"
  //         ).length;
  //         setPresentCount(present);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch school dashboard data", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  if (loading)
    return (
      <div className="p-8 text-center">Memuat data sekolah dashboard...</div>
    );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
            Dashboard Sekolah
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <School size={16} /> {schoolProfile.name} • {schoolProfile.province}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <Calendar className="text-blue-600" size={18} />
          <span className="text-sm font-medium text-gray-600">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Utensils size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase">
                  Total Distribusi
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.mealsDistributed || 0}
                </h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase">
                  Tingkat Kehadiran
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.attendanceRate || 0}%
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-blue-900">
                Monitor Presensi
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Real-time data kehadiran siswa hari ini.
              </p>
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                <div className="text-6xl font-bold text-blue-600 tracking-tight">
                  {presentCount}
                  <span className="text-2xl text-gray-400 font-medium ml-2">
                    / {schoolProfile.totalMurid}
                  </span>
                </div>
              </div>

              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
                Siswa Hadir & Menerima Makan
              </div>

              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden mb-2">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: `${
                      schoolProfile.totalMurid > 0
                        ? (presentCount / schoolProfile.totalMurid) * 100
                        : 0
                    }%`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                {schoolProfile.totalMurid > 0
                  ? Math.round((presentCount / schoolProfile.totalMurid) * 100)
                  : 0}
                % dari total siswa telah melakukan presensi.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-900">
                Riwayat Laporan
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-bold">
                Lihat Semua
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {reports.length > 0 ? (
                reports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {report.date}
                        </p>
                        <p className="text-xs text-gray-500">{report.menu}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          report.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : report.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {report.status === "approved"
                          ? "Diverifikasi"
                          : report.status === "pending"
                          ? "Menunggu"
                          : "Ditolak"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {report.totalStudents} Siswa
                      </span>
                      <span className="flex items-center gap-1">
                        <Utensils size={12} /> {report.distributed} Porsi
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Belum ada riwayat laporan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataMuridPage = ({ students: initialStudents }: { students: any[] }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    setTimeout(() => {
      const newStudents: Student[] = [];

      setStudents((prev) => [...prev, ...newStudents]);
      setIsImporting(false);
      alert(
        `Berhasil mengimport ${newStudents.length} data siswa baru dari ${file.name}!`
      );

      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1500);
  };

  useEffect(() => {
    if (initialStudents) {
      const mappedStudents = initialStudents.map((s: ApiStudent) => ({
        id: s._id,
        name: s.fullName,
        nisn: s.username,
        class: s.class || "X-A",
        status: s.status || "-",
        gender: s.gender || "L",
      }));
      setStudents(mappedStudents);
    }
  }, [initialStudents]);

  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     try {
  //       const res = await fetch("/api/dashboard/sekolah");
  //       const data = await res.json();
  //       if (data.students) {
  //         const mappedStudents = data.students.map((s: ApiStudent) => ({
  //           id: s._id,
  //           name: s.fullName,
  //           nisn: s.username,
  //           class: s.class || "X-A",
  //           status: s.status || "-",
  //           gender: s.gender || "L",
  //         }));
  //         setStudents(mappedStudents);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch students", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStudents();
  // }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus siswa ini?")) return;
    try {
      await fetch(`/api/dashboard/sekolah?studentId=${id}`, {
        method: "DELETE",
      });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Gagal menghapus siswa");
    }
  };

  const handleUpdate = async (updatedData: Student) => {
    try {
      await fetch("/api/dashboard/sekolah", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedData.id ? updatedData : s))
      );
      setEditingStudent(null);
    } catch (error) {
      console.error("Failed to update", error);
      alert("Gagal mengupdate siswa");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="p-8 text-center">Memuat data sekolah dashboard...</div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <EditStudentModal
        student={editingStudent}
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleUpdate}
      />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Data Murid</h1>
          <p className="text-gray-500">
            Manajemen data {students.length} siswa penerima manfaat.
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            disabled={isImporting}
            className={`px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm ${
              isImporting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload size={18} /> Import Excel
              </>
            )}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            <UserPlus size={18} /> Tambah Siswa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 bg-gray-50/50">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama atau NISN..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-gray-900"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Semua Kelas</option>
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-16">No</th>
                <th className="px-6 py-4">Nama Lengkap / NISN</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">L/P</th>
                <th className="px-6 py-4">Status Hari Ini</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentStudents.map((s, index) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4 text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          s.gender === "L" ? "bg-blue-500" : "bg-pink-500"
                        }`}
                      >
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {s.name}
                        </div>
                        <div className="text-xs text-gray-400">{s.nisn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded text-xs font-medium border border-gray-200">
                      {s.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.gender}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        s.status === "Hadir"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.status === "Hadir" && <Check size={10} />}
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingStudent(s)}
                        className="p-1.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:text-blue-600 hover:border-blue-200 transition-colors"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:text-red-600 hover:border-red-200 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>Menampilkan {students.length} data</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="flex items-center px-2 text-gray-600">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LaporanPage = ({ data }: { data: any }) => {
  const [filterDate, setFilterDate] = useState("November 2025");
  const [reports, setReports] = useState<DashboardReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      const sourceReports = data.dailyReports || data.reports || [];

      const mapped = sourceReports.map((r: ApiReport) => ({
        id: r._id,
        date: new Date(r.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        rawDate: new Date(r.createdAt),
        menu: r.title || "Menu Standar",
        totalStudents: r.totalStudents || 0,
        distributed: r.mealsDistributed || 0,
        status: r.status,
        notes: r.description,
      }));
      setReports(mapped);
    }
  }, [data]);

  // useEffect(() => {
  //   const fetchReports = async () => {
  //     try {
  //       const res = await fetch("/api/dashboard/sekolah");
  //       const data = await res.json();
  //       const sourceReports = data.dailyReports || data.reports || [];

  //       const mapped = sourceReports.map((r: ApiReport) => ({
  //         id: r._id,
  //         date: new Date(r.createdAt).toLocaleDateString("id-ID", {
  //           day: "2-digit",
  //           month: "short",
  //           year: "numeric",
  //         }),
  //         rawDate: new Date(r.createdAt),
  //         menu: r.title || "Menu Standar",
  //         totalStudents: r.totalStudents || 0,
  //         distributed: r.mealsDistributed || 0,
  //         status: r.status,
  //         notes: r.description,
  //       }));
  //       setReports(mapped);
  //     } catch (error) {
  //       console.error("Failed to fetch reports", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchReports();
  // }, []);

  const filteredReports = reports.filter((r: any) => {
    const reportDate = r.rawDate;
    const [monthStr, yearStr] = filterDate.split(" ");
    const reportMonth = reportDate.toLocaleString("id-ID", { month: "long" });
    const reportYear = reportDate.getFullYear().toString();
    return (
      reportMonth.toLowerCase() === monthStr.toLowerCase() &&
      reportYear === yearStr
    );
  });

  const verifiedCount = filteredReports.filter(
    (r) => r.status === "approved"
  ).length;
  const totalCount = filteredReports.length;
  const verificationRate =
    totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
            <CheckCircle size={12} /> Diverifikasi
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
            <Clock size={12} /> Menunggu
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
            <AlertTriangle size={12} /> Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center">Memuat data sekolah dashboard...</div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Riwayat Laporan</h1>
          <p className="text-gray-500 mt-1">
            Arsip laporan distribusi makanan harian dan status verifikasi.
          </p>
        </div>
        <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
          <Download size={18} className="text-blue-600" /> Download Rekap
          Bulanan
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium appearance-none focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            >
              <option>November 2025</option>
              <option>Oktober 2025</option>
              <option>September 2025</option>
            </select>
            <MoreHorizontal
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90"
              size={14}
            />
          </div>
          <span className="text-sm text-gray-500">
            Menampilkan <strong>{filteredReports.length}</strong> laporan
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="h-8 px-3 rounded-lg bg-green-50 text-green-700 text-xs font-bold flex items-center justify-center border border-green-100">
            {verificationRate}% Terverifikasi
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">ID & Tanggal</th>
                <th className="px-6 py-4">Menu Utama</th>
                <th className="px-6 py-4 text-center">Distribusi</th>
                <th className="px-6 py-4">Bukti</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada laporan untuk periode ini.
                  </td>
                </tr>
              ) : (
                filteredReports.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-blue-900">{item.date}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {item.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-gray-700 font-medium block truncate max-w-[200px]"
                        title={item.menu}
                      >
                        {item.menu}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-gray-800">
                        {item.distributed}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        dari {item.totalStudents} siswa
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline">
                        <Camera size={14} /> Lihat Foto
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                      {item.status === "rejected" && (
                        <div className="text-[10px] text-red-500 mt-1 max-w-[140px] leading-tight">
                          Note: {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        title="Detail Laporan"
                        onClick={() =>
                          alert(`Detail laporan ${item.id} akan segera hadir.`)
                        }
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentReportDetailModal = ({
  report,
  onClose,
}: {
  report: any;
  onClose: () => void;
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-900">
            Detail Laporan Siswa
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Judul Laporan
            </label>
            <p className="text-gray-900 font-medium text-lg mt-1">
              {report.title}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Pelapor
              </label>
              <p className="text-gray-900 mt-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {report.reporterId.charAt(0).toUpperCase()}
                </span>
                {report.reporterId}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tanggal
              </label>
              <p className="text-gray-900 mt-1 flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                {new Date(report.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Kategori & Status
            </label>
            <div className="flex gap-2 mt-2">
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                {report.category}
              </span>
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                  report.status === "resolved"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : report.status === "pending"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {report.status === "resolved"
                  ? "Selesai"
                  : report.status === "pending"
                  ? "Menunggu"
                  : report.status}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Deskripsi
            </label>
            <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed">
              {report.description || "Tidak ada deskripsi."}
            </div>
          </div>

          {report.image && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Bukti Foto
              </label>
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={report.image}
                  alt="Bukti Laporan"
                  className="w-full h-auto object-cover max-h-60"
                />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const LaporanSiswaPage = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/dashboard/sekolah");
        const data = await res.json();
        if (data.studentReports) {
          setReports(data.studentReports);
        }
      } catch (error) {
        console.error("Failed to fetch student reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {selectedReport && (
        <StudentReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Laporan Siswa</h1>
          <p className="text-gray-500 mt-1">
            Daftar keluhan dan masukan dari siswa.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Judul Laporan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Memuat data sekolah dashboard...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Belum ada laporan dari siswa.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report._id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {new Date(report.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {report.reporterId}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{report.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : report.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {report.status === "resolved"
                          ? "Selesai"
                          : report.status === "pending"
                          ? "Menunggu"
                          : report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="text-blue-600 hover:underline text-xs font-bold"
                        onClick={() => setSelectedReport(report)}
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NotifikasiPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info size={20} className="text-blue-600" />;
      case "danger":
        return <AlertTriangle size={20} className="text-red-600" />;
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "warning":
        return <Clock size={20} className="text-orange-600" />;
      default:
        return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200";
      case "danger":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Pusat Notifikasi</h1>
          <p className="text-gray-500">
            Update terbaru dari pusat MBG dan dinas terkait.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`relative p-5 rounded-xl border transition-all hover:shadow-sm ${
                notif.read
                  ? "bg-white border-gray-100 opacity-75"
                  : "bg-white border-blue-100 shadow-sm"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getBgColor(
                    notif.type
                  )}`}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`text-sm font-bold ${
                        notif.read ? "text-gray-700" : "text-gray-900"
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-xs text-gray-400">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
              {!notif.read && (
                <div className="absolute top-5 right-5 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
            <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p>Tidak ada notifikasi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PengaturanPage = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/dashboard/sekolah");
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center">Memuat data sekolah dashboard...</div>
    );

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Pengaturan Sekolah</h1>
        <p className="text-gray-500">
          Kelola profil sekolah dan preferensi akun.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
              activeTab === "profile"
                ? "bg-blue-50 text-blue-700"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <School size={18} /> Profil Sekolah
          </button>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          {activeTab === "profile" ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {profile?.name?.substring(0, 3).toUpperCase() || "SCH"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {profile?.name || "Nama Sekolah"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    NPSN: {profile?.npsn || "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    defaultValue={profile?.name || ""}
                    disabled
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    defaultValue={profile?.province || ""}
                    disabled
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={profile?.address || ""}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Penanggung Jawab
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="email"
                      defaultValue={profile?.email || ""}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-gray-900">Keamanan Akun</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Password
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Terakhir diubah 3 bulan yang lalu
                    </p>
                  </div>
                  <button className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    Ubah
                  </button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Tambahkan keamanan ekstra untuk akun sekolah
                    </p>
                  </div>
                  <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full bg-gray-200 cursor-pointer">
                    <span className="translate-x-0 inline-block w-4 h-4 ml-1 mt-1 bg-white rounded-full shadow transform transition"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LaporSesuatuPage = () => {
  const router = useRouter();
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/lapor?role=sekolah");
        const data = await res.json();
        if (data.tickets) {
          setMyTickets(data.tickets);
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Lapor Sesuatu</h1>
          <p className="text-gray-500">
            Laporkan masalah atau insiden terkait program MBG.
          </p>
        </div>
        <button
          onClick={() => router.push("/lapor")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
        >
          <AlertTriangle size={18} /> Buat Laporan Baru
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-blue-900">Tiket Saya</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat data sekolah dashboard...
          </div>
        ) : myTickets.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {myTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/lapor/${ticket._id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {ticket.description}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                      ticket.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "escalated"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {ticket.schoolName || "Sekolah"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Belum ada tiket laporan yang Anda buat atau terlibat.
          </div>
        )}
      </div>
    </div>
  );
};

export default function SekolahDashboardPage() {
  const router = useRouter();
  const { tab } = router.query;
  const activeTab = (Array.isArray(tab) ? tab[0] : tab) || "dashboard";
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/sekolah");
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch school dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getActiveMenu = (): SidebarMenuKey => {
    if (activeTab === "murid") return "murid";
    if (activeTab === "laporan") return "laporan";
    if (activeTab === "laporan-siswa") return "laporan-siswa";
    if (activeTab === "lapor") return "lapor";
    if (activeTab === "notifikasi") return "notifikasi";
    if (activeTab === "pengaturan") return "pengaturan";
    return "dashboard";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome data={dashboardData} loading={loading} />;
      case "murid":
        return <DataMuridPage students={dashboardData?.students || []} />;
      case "laporan":
        return <LaporanPage data={dashboardData} />;
      case "laporan-siswa":
        return <LaporanSiswaPage />;
      case "lapor":
        return <LaporSesuatuPage />;
      case "notifikasi":
        return <NotifikasiPage />;
      case "pengaturan":
        return <PengaturanPage />;
      default:
        return <DashboardHome data={dashboardData} loading={loading} />;
    }
  };

  return (
    <MbgSidebarLayout
      role="sekolah"
      activeMenu={getActiveMenu()}
      contentClassName="bg-[#f7f5f0] min-h-screen main-content pt-[20px] px-[16px] pb-[24px] md:p-[30px]"
    >
      <Head>
        <title>Dashboard Sekolah - MBGsecure</title>
      </Head>

      {renderContent()}
    </MbgSidebarLayout>
  );
}
