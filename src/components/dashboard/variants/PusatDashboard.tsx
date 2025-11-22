import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Utensils,
  School,
  CheckCircle,
  AlertTriangle,
  Search,
  Bell,
  User,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Eye,
  X,
  Check,
  MoreVertical,
  AlertCircle,
  Clock,
  ArrowRight,
  Truck,
  MapPin,
  Archive,
  UserPlus,
  FileText,
  FileSignature,
  ChartLine,
  BarChart3,
  LayoutDashboard,
  Headset,
  XCircle,
} from "lucide-react";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";
import type { DashboardVariant } from "../types";

type PusatDashboardProps = {
  variant?: DashboardVariant | null;
};

type ReportStatus = "pending" | "approved" | "rejected";
type Report = {
  id: number;
  name: string;
  location: string;
  date: string;
  type: string;
  status: ReportStatus;
};

interface NutritionItem {
  name: string;
  value?: number;
  protein?: number;
}

interface PusatStats {
  totalReports: number;
  pendingReports: number;
  participationRate: number;
  distributionData: { name: string; value: number }[];
  nutritionData: NutritionItem[];
}

interface ApiPusatReport {
  _id: string;
  schoolId?: string;
  district?: string;
  createdAt: string;
  category: string;
  status: ReportStatus;
}

const formatThousandsShort = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const formatted = (value / 1_000_000).toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}M`;
  }
  if (abs >= 1_000) {
    const formatted = (value / 1_000).toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  return value.toString();
};

const formatRelativeTime = (dateInput: string | number | Date) => {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// komponen

const DistributionPage = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/pusat");
        const json = await res.json();
        if (json.recentReports) {
          const mappedData = json.recentReports.map((r: any, idx: number) => ({
            id: idx + 1,
            school: r.schoolId || "Sekolah",
            menu: "Menu Standar",
            qty: 450,
            time: new Date(r.createdAt).toLocaleTimeString(),
            status: r.status === "approved" ? "delivered" : "pending",
          }));
          setData(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">
          Monitor Distribusi Makanan (Nasional)
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
          <Truck size={16} /> Lacak Armada
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            Total Porsi Hari Ini
          </div>
          <div className="text-3xl font-bold text-blue-900">1.5M</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            Armada Berjalan
          </div>
          <div className="text-3xl font-bold text-blue-900">1,240</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            Terkirim
          </div>
          <div className="text-3xl font-bold text-green-600">88%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-900">
            Jadwal Distribusi Terkini
          </h3>
          <button className="text-gray-500 hover:text-blue-600 flex items-center gap-2 text-sm border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            <Filter size={14} /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Sekolah</th>
                <th className="px-6 py-4">Menu</th>
                <th className="px-6 py-4">Jumlah</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{item.school}</td>
                  <td className="px-6 py-4">{item.menu}</td>
                  <td className="px-6 py-4">{item.qty}</td>
                  <td className="px-6 py-4">{item.time}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : item.status === "transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status === "delivered"
                        ? "Terkirim"
                        : item.status === "transit"
                        ? "Di Jalan"
                        : "Menunggu"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SchoolProgramPage = () => {
  const router = useRouter();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/dashboard/pusat");
        const data = await res.json();
        if (data.schools) {
          setSchools(data.schools);
        }
      } catch (error) {
        console.error("Failed to fetch schools", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">
          Data Sekolah Penerima Manfaat (Nasional)
        </h2>
        <button
          onClick={() => router.push("/dashboard?tab=addUser")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <UserPlus size={16} /> Tambah Sekolah
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <School size={28} />
            </div>
            <div className="text-center mb-4">
              <h4 className="text-lg font-bold text-blue-900 mb-1">
                {school.name}
              </h4>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={12} /> {school.pic}
                </span>
                <span className="flex items-center gap-1">
                  <Utensils size={12} /> {school.students}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-4">
              <span className="text-xs font-medium text-gray-500">
                Skor Kepatuhan
              </span>
              <span className="text-sm font-bold text-green-600">
                {school.score}%
              </span>
            </div>
            <button className="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              Detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const QualityReportPage = () => {
  const [schools, setSchools] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/dashboard/pusat");
        const data = await res.json();
        if (data.schools) {
          setSchools(data.schools);
        }
      } catch (error) {
        console.error("Failed to fetch schools", error);
      }
    };
    fetchSchools();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">
          Laporan Kualitas Gizi & Rasa
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900">
              Input Laporan Baru
            </h3>
          </div>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Sekolah / Titik Distribusi
              </label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900">
                <option>Pilih Sekolah...</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Pengecekan
              </label>
              <input
                type="date"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parameter Rasa (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan Temuan
              </label>
              <textarea
                rows={4}
                placeholder="Deskripsikan temuan kualitas..."
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Kirim Laporan
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900">
              Tren Kualitas Bulan Ini
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { name: "W1", score: 8.5 },
                  { name: "W2", score: 8.2 },
                  { name: "W3", score: 8.8 },
                  { name: "W4", score: 9.0 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0f52ba"
                  fill="rgba(15, 82, 186, 0.1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerificationPage = () => {
  const [verifications, setVerifications] = useState([
    {
      id: 1,
      title: "Pengajuan Dana Tambahan",
      user: "SPPG Banyuwangi",
      amount: "Rp 15.000.000",
      date: "06 Nov 2025",
      status: "pending",
    },
    {
      id: 2,
      title: "Perubahan Menu Vendor",
      user: "SPPG Kediri",
      amount: "-",
      date: "05 Nov 2025",
      status: "pending",
    },
    {
      id: 3,
      title: "Klaim Kerusakan Alat",
      user: "SPPG Jember",
      amount: "Rp 2.500.000",
      date: "04 Nov 2025",
      status: "approved",
    },
  ]);

  const handleAction = (id: number, status: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900">
        Verifikasi Dokumen SPPG
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Dokumen</th>
                <th className="px-6 py-4">Pengaju</th>
                <th className="px-6 py-4">Nominal</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {verifications.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-900">
                    {v.title}
                  </td>
                  <td className="px-6 py-4">{v.user}</td>
                  <td className="px-6 py-4">{v.amount}</td>
                  <td className="px-6 py-4">{v.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        v.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : v.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {v.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                          onClick={() => handleAction(v.id, "approved")}
                          title="Setujui"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                          onClick={() => handleAction(v.id, "rejected")}
                          title="Tolak"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AlertsPage = () => {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/dashboard/pusat");
        const data = await res.json();
        if (data.alerts) {
          setAlerts(data.alerts);
        }
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900">
        Pusat Peringatan & Insiden
      </h2>
      <div className="space-y-4">
        {loading && (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100">
            Memuat peringatan terbaru...
          </div>
        )}
        {!loading && alerts.length === 0 && (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100">
            Belum ada peringatan.
          </div>
        )}
        {!loading &&
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex gap-4 p-5 bg-white rounded-xl border-l-4 shadow-sm ${
                alert.type === "danger"
                  ? "border-l-red-500"
                  : alert.type === "warning"
                  ? "border-l-yellow-500"
                  : "border-l-blue-500"
              }`}
            >
              <div
                className={`shrink-0 mt-1 ${
                  alert.type === "danger"
                    ? "text-red-500"
                    : alert.type === "warning"
                    ? "text-yellow-500"
                    : "text-blue-500"
                }`}
              >
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {alert.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {alert.location}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {formatRelativeTime(alert.time)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{alert.desc}</p>
              </div>
              <button
                className="self-start px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={() => {
                  const targetId = alert.ticketId || alert.id;
                  if (targetId) {
                    router.push(`/lapor/${targetId}`);
                  } else {
                    router.push("/lapor");
                  }
                }}
              >
                Tangani
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

const StatsPage = () => {
  const pieData = [
    { name: "Terserap", value: 85 },
    { name: "Sisa", value: 10 },
    { name: "Rusak/Hilang", value: 5 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900">
        Statistik Nasional Mendalam
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900">
              Efisiensi Penyerapan Anggaran
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                ></span>
                <span className="text-gray-600">
                  {entry.name} ({entry.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900">
              Demografi Penerima Manfaat
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  SD (Sekolah Dasar)
                </span>
                <span className="font-bold text-blue-900">65%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">SMP</span>
                <span className="font-bold text-blue-900">25%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-blue-400 h-2.5 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  Ibu Hamil / Balita
                </span>
                <span className="font-bold text-blue-900">10%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "10%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchivePage = () => {
  const folders = [
    "Laporan Januari 2025",
    "Laporan Februari 2025",
    "Kontrak Vendor",
    "Data Siswa 2024/2025",
    "Dokumentasi Kegiatan",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900">Arsip Data & Laporan</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {folders.map((folder, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group"
            >
              <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                <Archive size={48} />
              </div>
              <div className="text-sm font-medium text-center text-blue-900 group-hover:text-blue-700">
                {folder}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddUserPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    npsn: "",
    name: "",
    principal: "",
    email: "",
    district: "",
  });

  const [mitras, setMitras] = useState<any[]>([]);
  const [loadingMitras, setLoadingMitras] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/dashboard/pusat");
        const data = await res.json();
        if (data.schools) {
          setUsers(data.schools);
        }
      } catch (error) {
        console.error("Failed to fetch schools", error);
      }
    };
    fetchSchools();
    fetchMitras();
  }, []);

  const fetchMitras = async () => {
    setLoadingMitras(true);
    try {
      const res = await fetch("/api/users/mitra");
      const data = await res.json();
      if (data.ok) {
        setMitras(data.mitras);
      }
    } catch (error) {
      console.error("Failed to fetch mitras", error);
    } finally {
      setLoadingMitras(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900">Manajemen User</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          Daftar Sekolah & Mitra
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Wilayah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-blue-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4">Sekolah</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.district}</td>
                </tr>
              ))}
              {mitras.map((mitra) => (
                <tr
                  key={mitra._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-blue-900">
                    {mitra.fullName}
                  </td>
                  <td className="px-6 py-4">Mitra</td>
                  <td className="px-6 py-4">{mitra.username}</td>
                  <td className="px-6 py-4">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DashboardHome = ({ variant }: { variant?: DashboardVariant | null }) => {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<PusatStats | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/dashboard/pusat");
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await res.json();
        if (data.recentReports) {
          const mappedReports = data.recentReports.map((r: ApiPusatReport) => ({
            id: r._id,
            name: r.schoolId || "Sekolah",
            location: r.district || "Jawa Timur",
            date: new Date(r.createdAt).toLocaleString(),
            type: r.category,
            status: r.status,
          }));
          setReports(mappedReports);
        }
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.alerts) {
          setAlerts(data.alerts);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const distributionData = stats?.distributionData || [];

  const nutritionData =
    stats?.nutritionData?.map((item: NutritionItem) => ({
      name: item.name,
      value: item.value || item.protein || 0,
    })) || [];

  const handleApprove = (id: number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved" as ReportStatus } : r
      )
    );
  };

  const handleReject = (id: number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rejected" as ReportStatus } : r
      )
    );
  };

  const handleView = () => {
    alert("Fitur detail laporan akan segera hadir.");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
            Selamat Datang, Admin BGN
          </h1>
          <p className="text-gray-500 mt-1">
            {variant?.heroSummary ??
              "Berikut adalah ringkasan data program MBG hari ini."}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari data..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
            />
          </div>
          <button
            type="button"
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-blue-900 hover:bg-gray-50 transition-colors shrink-0"
            onClick={() => router.push("/lapor")}
            aria-label="Buka percakapan tiket"
          >
            <i className="fas fa-comments" />
          </button>
          <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-blue-900 hover:bg-gray-50 transition-colors relative shrink-0">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              5
            </span>
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg flex items-center justify-center text-white overflow-hidden">
              <img
                src="/assets/images/logo.png"
                alt="Admin BGN"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-bold text-blue-900">Admin BGN</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                Administrator
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-blue-900 font-medium">Memuat data dashboard...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6 text-center my-6">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-red-500 font-bold text-lg mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs font-bold text-gray-400 uppercase">
                  Total Distribusi Makanan
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Utensils size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {stats
                  ? formatThousandsShort(stats.totalReports * 1000)
                  : "..."}
              </div>
              <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                <ArrowUp size={12} /> +12.5%{" "}
                <span className="text-gray-400">dari minggu lalu</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs font-bold text-gray-400 uppercase">
                  Sekolah Terdaftar
                </div>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                  <School size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {stats
                  ? formatThousandsShort(stats.pendingReports * 100)
                  : "..."}
              </div>
              <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                <ArrowUp size={12} /> +5.2%{" "}
                <span className="text-gray-400">dari minggu lalu</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs font-bold text-gray-400 uppercase">
                  Tingkat Kepatuhan
                </div>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                  <CheckCircle size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">
                {stats ? stats.participationRate + "%" : "..."}
              </div>
              <div className="text-xs font-medium text-red-600 flex items-center gap-1">
                <ArrowDown size={12} /> -2.1%{" "}
                <span className="text-gray-400">dari minggu lalu</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs font-bold text-gray-400 uppercase">
                  SPPG Bermasalah
                </div>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                  <AlertTriangle size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">23</div>
              <div className="text-xs font-medium text-red-600 flex items-center gap-1">
                <ArrowUp size={12} /> +8{" "}
                <span className="text-gray-400">dari minggu lalu</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-blue-900">
                  Distribusi Makanan per Kota
                </h3>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distributionData}
                    margin={{ top: 5, right: 10, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(192, 178, 160, 0.35)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#002366", fontSize: 11 }}
                    />
                    <YAxis
                      tick={{ fill: "#C0B2A0", fontSize: 11 }}
                      tickFormatter={formatThousandsShort}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name="Jumlah Distribusi"
                      fill="rgba(15, 82, 186, 0.7)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-blue-900">
                  Kualitas Gizi Makanan
                </h3>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={nutritionData}
                    margin={{ top: 5, right: 10, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(192, 178, 160, 0.35)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#002366", fontSize: 11 }}
                    />
                    <YAxis
                      domain={[70, 100]}
                      tick={{ fill: "#C0B2A0", fontSize: 11 }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Skor Kualitas Gizi"
                      stroke="#0F52BA"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#0F52BA" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-900">
                Peringatan Penting
              </h3>
              <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                Lihat Semua <ArrowRight size={14} />
              </button>
            </div>

            {alerts.length === 0 ? (
              <div className="p-5 bg-white rounded-xl border border-gray-100 text-center text-gray-500">
                Tidak ada peringatan saat ini.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex gap-4 p-5 bg-white rounded-xl border-l-4 ${
                    alert.type === "danger"
                      ? "border-l-red-500"
                      : "border-l-yellow-500"
                  } shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div
                    className={`shrink-0 mt-1 ${
                      alert.type === "danger"
                        ? "text-red-500 bg-red-50"
                        : "text-yellow-500 bg-yellow-50"
                    } p-3 rounded-xl`}
                  >
                    {alert.type === "danger" ? (
                      <AlertCircle size={24} />
                    ) : (
                      <AlertTriangle size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-blue-900 mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{alert.desc}</p>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />{" "}
                      {new Date(alert.time).toLocaleTimeString()} •{" "}
                      {alert.location}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-bold text-blue-900">
                Laporan SPPG Menunggu Persetujuan
              </h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors">
                  <Filter size={14} /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors">
                  <Download size={14} /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Nama SPPG</th>
                    <th className="px-6 py-4">Provinsi</th>
                    <th className="px-6 py-4">Tanggal Laporan</th>
                    <th className="px-6 py-4">Jenis Laporan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {reports.map((report, idx) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{idx + 1}</td>
                      <td className="px-6 py-4 font-medium text-blue-900">
                        {report.name}
                      </td>
                      <td className="px-6 py-4">{report.location}</td>
                      <td className="px-6 py-4">{report.date}</td>
                      <td className="px-6 py-4">{report.type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            report.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : report.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {report.status === "pending"
                            ? "Menunggu"
                            : report.status === "approved"
                            ? "Disetujui"
                            : "Ditolak"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                            onClick={handleView}
                            title="Lihat"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleApprove(report.id)}
                            disabled={report.status !== "pending"}
                            title="Setujui"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleReject(report.id)}
                            disabled={report.status !== "pending"}
                            title="Tolak"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PusatDashboard = ({ variant }: PusatDashboardProps) => {
  const router = useRouter();
  const { tab } = router.query;
  const activeTab = (Array.isArray(tab) ? tab[0] : tab) || "dashboard";
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const res = await fetch("/api/dashboard/pusat");
        const data = await res.json();
        const alertsLen = Array.isArray(data.alerts) ? data.alerts.length : 0;
        if (alertsLen > 0) {
          setAlertCount(alertsLen);
        }
      } catch (error) {
        console.error("Failed to fetch alert count", error);
      }
    };
    fetchAlertCount();
  }, []);

  const getActiveMenu = () => {
    switch (activeTab) {
      case "distribution":
        return "distribusi";
      case "schools":
        return "sekolah";
      case "alerts":
        return "peringatan";
      case "addUser":
        return "users";
      case "lapor":
        return "lapor";
      case "quality":
        return "quality";
      case "verification":
        return "verifikasi";
      case "reports":
        return "reports";
      case "stats":
        return "stats";
      case "archive":
        return "archive";
      default:
        return "dashboard";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome variant={variant} />;
      case "distribution":
        return <DistributionPage />;
      case "schools":
        return <SchoolProgramPage />;
      case "quality":
        return <QualityReportPage />;
      case "verification":
        return <VerificationPage />;
      case "alerts":
        return <AlertsPage />;
      case "reports":
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-900">
              Laporan Wilayah (PDF Generator)
            </h2>
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
              Fitur Export PDF sedang diproses...
            </div>
          </div>
        );
      case "stats":
        return <StatsPage />;
      case "archive":
        return <ArchivePage />;
      case "addUser":
        return <AddUserPage />;
      default:
        return <DashboardHome variant={variant} />;
    }
  };

  return (
    <MbgSidebarLayout
      role="pusat"
      activeMenu={getActiveMenu()}
      contentClassName="bg-[#f7f5f0] min-h-screen main-content pt-[20px] px-[16px] pb-[24px] md:p-[30px]"
      badges={{
        peringatan: alertCount > 0 ? (alertCount > 9 ? "9+" : alertCount) : 0,
      }}
    >
      {renderContent()}
    </MbgSidebarLayout>
  );
};

export default PusatDashboard;

{
  /* Styles from tka.tsx */
}
<style jsx global>{`
  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .main-content {
    animation: fadeSlideUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both 0.1s;
  }
`}</style>;
