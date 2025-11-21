import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";

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
  Shield,
  LayoutDashboard,
  Utensils,
  School,
  ChartLine,
  FileSignature,
  AlertTriangle,
  FileText,
  BarChart3,
  Archive,
  UserPlus,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  User,
  ChevronDown,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Download,
  MapPin,
  Calendar,
  Clock,
  Truck,
  Save,
  MoreVertical,
  ArrowRight,
  AlertCircle,
  Trash2,
  Edit,
  EyeOff,
} from "lucide-react";

// Parse (lagi)

const formatThousandsShort = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
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

//  pages sidebar

const DistributionPage = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/daerah");
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
          Monitor Distribusi Makanan
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
          <div className="text-3xl font-bold text-blue-900">15.400</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            Armada Berjalan
          </div>
          <div className="text-3xl font-bold text-blue-900">42</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            Terkirim
          </div>
          <div className="text-3xl font-bold text-green-600">85%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-900">
            Jadwal Pengiriman Hari Ini
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
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/dashboard/daerah");
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
          Data Sekolah Penerima Manfaat
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
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
        const res = await fetch("/api/dashboard/daerah");
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
        const res = await fetch("/api/dashboard/daerah");
        const data = await res.json();
        if (data.alerts) {
          setAlerts(data.alerts);
        } else if (data.recentReports) {
          setAlerts(
            data.recentReports.map((r: any, idx: number) => ({
              id: r._id || idx + 1,
              ticketId: r._id ?? null,
              type:
                r.priority === "high"
                  ? "danger"
                  : r.priority === "medium"
                  ? "warning"
                  : "info",
              title: r.title ?? "Laporan Wilayah",
              location: r.schoolId || r.district || "Tidak diketahui",
              time: r.createdAt,
              desc: r.description ?? "Laporan baru masuk.",
            }))
          );
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
        Statistik Daerah Mendalam
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
        const res = await fetch("/api/dashboard/daerah");
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

  const [mitraForm, setMitraForm] = useState({
    username: "",
    password: "verySecureAndSecretPassword123!",
    fullName: "",
    email: "",
    district: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMitraInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMitraForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.npsn || !formData.name) return;

    const newUser = {
      id: users.length + 1,
      ...formData,
    };

    setUsers([...users, newUser]);
    setFormData({ npsn: "", name: "", principal: "", email: "", district: "" });
  };

  const handleMitraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mitraForm.username || !mitraForm.fullName) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mitraForm,
          role: "mitra",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Mitra berhasil ditambahkan!");
        setMitraForm({
          username: "",
          password: "password123",
          fullName: "",
          email: "",
          district: "",
        });
        fetchMitras();
      } else {
        alert(`Gagal menambahkan mitra: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating mitra:", error);
      alert("Terjadi kesalahan saat menambahkan mitra.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-900">
        Manajemen Akun Sekolah
      </h2>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-900">
              Tambah Akun Sekolah Baru
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPSN Sekolah
                </label>
                <input
                  type="text"
                  name="npsn"
                  value={formData.npsn}
                  onChange={handleInputChange}
                  placeholder="Contoh: 20512345"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: SDN 1 Nusantara"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  name="principal"
                  value={formData.principal}
                  onChange={handleInputChange}
                  placeholder="Contoh: Budi Santoso, S.Pd"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Admin Sekolah
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@sekolah.sch.id"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wilayah Kecamatan
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                >
                  <option value="">Pilih Kecamatan...</option>
                  <option value="Klojen">Klojen</option>
                  <option value="Blimbing">Blimbing</option>
                  <option value="Lowokwaru">Lowokwaru</option>
                  <option value="Sukun">Sukun</option>
                  <option value="Kedungkandang">Kedungkandang</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setFormData({
                    npsn: "",
                    name: "",
                    principal: "",
                    email: "",
                    district: "",
                  })
                }
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Buat Akun
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-900">
              Daftar Akun Terdaftar
            </h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors">
                <Search size={14} /> Cari
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
                  <th className="px-6 py-4">NPSN</th>
                  <th className="px-6 py-4">Nama Sekolah</th>
                  <th className="px-6 py-4">Kepala Sekolah</th>
                  <th className="px-6 py-4">Email Admin</th>
                  <th className="px-6 py-4">Kecamatan</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-gray-500">
                      {user.npsn}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4">{user.principal}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.district}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      Belum ada data sekolah.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                Tambah Mitra Pengadaan Baru
              </h3>
              <p className="text-sm text-gray-500">
                Gunakan ini untuk menambahkan mitra catering di wilayah Anda.
              </p>
            </div>
          </div>
          <form
            onSubmit={handleMitraSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Mitra
              </label>
              <input
                type="text"
                name="fullName"
                value={mitraForm.fullName}
                onChange={handleMitraInputChange}
                placeholder="Contoh: CV Mitra Sejahtera"
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username Mitra
              </label>
              <input
                type="text"
                name="username"
                value={mitraForm.username}
                onChange={handleMitraInputChange}
                placeholder="username_mitra"
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={mitraForm.email}
                onChange={handleMitraInputChange}
                placeholder="mitra@domain.id"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Default
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={mitraForm.password}
                  onChange={handleMitraInputChange}
                  placeholder="Password"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10 text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wilayah Layanan
              </label>
              <input
                type="text"
                name="district"
                value={mitraForm.district}
                onChange={handleMitraInputChange}
                placeholder="Kota/Kabupaten"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
              >
                Tambah Mitra
              </button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Mitra</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Wilayah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {mitras.map((m) => (
                  <tr
                    key={m._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-blue-900">
                      {m.fullName}
                    </td>
                    <td className="px-6 py-4">{m.username}</td>
                    <td className="px-6 py-4">{m.email || "-"}</td>
                    <td className="px-6 py-4">{m.district || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/daerah");
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.alerts) {
          setAlerts(data.alerts);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fallbackDistributionData = [
    { name: "Malang", value: 250000 },
    { name: "Surabaya", value: 220000 },
    { name: "Jember", value: 180000 },
    { name: "Kediri", value: 150000 },
    { name: "Jombang", value: 100000 },
  ];

  const fallbackNutritionData = [
    { name: "Jan", value: 85 },
    { name: "Feb", value: 87 },
    { name: "Mar", value: 90 },
    { name: "Apr", value: 88 },
    { name: "Mei", value: 82 },
    { name: "Jun", value: 79 },
  ];

  const distributionData = stats?.distributionData ?? fallbackDistributionData;
  const nutritionData = stats?.nutritionData ?? fallbackNutritionData;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
            Selamat Datang, Admin Daerah
          </h1>
          <p className="text-gray-500 mt-1">
            Berikut adalah ringkasan data program MBG hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-blue-900 hover:bg-gray-50 transition-colors"
            onClick={() => router.push("/lapor")}
            aria-label="Buka percakapan tiket"
          >
            <i className="fas fa-comments" />
          </button>
          <button
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-blue-900 hover:bg-gray-50 transition-colors relative"
            onClick={() => router.push("/dashboard?tab=alerts")}
          >
            <Bell size={20} />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {alerts.length > 9 ? "9+" : alerts.length}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-bold text-blue-900">
                Admin Daerah
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                Pengelola Wilayah
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-gray-400 uppercase">
              Total Laporan
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Utensils size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-2">
            {stats ? stats.totalReports : "..."}
          </div>
          <div className="text-xs font-medium text-green-600 flex items-center gap-1">
            ↑ +4.2% <span className="text-gray-400">dari minggu lalu</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-gray-400 uppercase">
              Sekolah Aktif
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <School size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-2">
            {stats ? stats.activeSchools : "..."}
          </div>
          <div className="text-xs font-medium text-green-600 flex items-center gap-1">
            ↑ +1.8% <span className="text-gray-400">dari minggu lalu</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-gray-400 uppercase">
              Laporan Pending
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-2">
            {stats ? stats.pendingReports : "..."}
          </div>
          <div className="text-xs font-medium text-red-600 flex items-center gap-1">
            ↑ +{stats ? stats.pendingReportsThisWeek : "..."}{" "}
            <span className="text-gray-400">baru minggu ini</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-gray-400 uppercase">
              Rate Distribusi
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-2">
            {stats ? stats.distributionRate + "%" : "..."}
          </div>
          <div className="text-xs font-medium text-red-600 flex items-center gap-1">
            ↓ -1.2% <span className="text-gray-400">dari minggu lalu</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-blue-900">
              Distribusi per Kota
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
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
              Kualitas Gizi Wilayah
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nutritionData}>
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
                  stroke="#0F52BA"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0F52BA" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-900">
            Peringatan Wilayah
          </h3>
          <button
            onClick={() => router.push("/dashboard?tab=alerts")}
            className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
          >
            Lihat Semua <ArrowRight size={14} />
          </button>
        </div>

        {loading && (
          <div className="bg-white p-6 rounded-xl text-center text-gray-500 border border-gray-100">
            Memuat peringatan terbaru...
          </div>
        )}
        {!loading &&
          alerts.slice(0, 2).map((alert) => (
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
                {alert.type === "danger" ? (
                  <AlertCircle size={24} />
                ) : (
                  <AlertTriangle size={24} />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {alert.title}
                </h4>
                <div className="text-sm text-gray-700 mb-2">{alert.desc}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {formatRelativeTime(alert.time)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

//  main dash

const DaerahDashboard = () => {
  const router = useRouter();
  const { tab } = router.query;
  const activeTab = (Array.isArray(tab) ? tab[0] : tab) || "dashboard";
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const res = await fetch("/api/dashboard/daerah");
        const data = await res.json();
        const alertsLen = Array.isArray(data.alerts) ? data.alerts.length : 0;
        if (alertsLen > 0) {
          setAlertCount(alertsLen);
          return;
        }
        const stats = data.stats || {};
        if (
          typeof stats.pendingReports === "number" &&
          stats.pendingReports > 0
        ) {
          setAlertCount(stats.pendingReports);
          return;
        }
        if (
          typeof stats.reportedIssues === "number" &&
          stats.reportedIssues > 0
        ) {
          setAlertCount(stats.reportedIssues);
          return;
        }
        if (
          Array.isArray(data.recentReports) &&
          data.recentReports.length > 0
        ) {
          setAlertCount(data.recentReports.length);
        }
      } catch (error) {
        console.error("Failed to fetch alert count", error);
      }
    };
    void fetchAlertCount();
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
        return <DashboardHome />;
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
        return <DashboardHome />;
    }
  };

  return (
    <MbgSidebarLayout
      role="daerah"
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

export default DaerahDashboard;

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
