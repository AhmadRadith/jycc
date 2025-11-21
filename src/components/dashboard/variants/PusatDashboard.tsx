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

const PusatDashboard = ({ variant }: PusatDashboardProps) => {
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
    <MbgSidebarLayout
      role="pusat"
      activeMenu="dashboard"
      contentClassName="bg-[#f7f5f0] min-h-screen main-content pt-[20px] px-[16px] pb-[24px] md:p-[30px]"
      badges={{ peringatan: 5, verifikasi: 12 }}
    >
      <div className="space-y-8">
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
            <p className="text-blue-900 font-medium">
              Memuat data dashboard...
            </p>
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
