import React, { useEffect, useRef, useState, FormEvent } from "react";
import { Calendar, CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { MbgSidebarLayout } from "@/components/layouts/MbgSidebarLayout";

export default function MitraDashboard() {
  const router = useRouter();
  const { tab } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [menuSchedules, setMenuSchedules] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [foodForm, setFoodForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/mitra");
        const data = await res.json();
        if (data.reports) {
          const mappedReports = data.reports.map((r: any) => ({
            id: r._id,
            school: r.schoolName || r.schoolId || "Sekolah",
            menu: "Menu Standar",
            qty: 100,
            status: r.status,
            time: new Date(r.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: new Date(r.createdAt).toLocaleDateString(),
            type: r.category || "Laporan Umum",
          }));
          setReports(mappedReports);
        }
        if (data.requests) {
          setRequests(data.requests);
        }
        if (data.foodItems) {
          setFoodItems(data.foodItems);
        }
        if (data.menuSchedules) {
          setMenuSchedules(data.menuSchedules);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const schedule = menuSchedules.find((s) => s.date === selectedDate);
    if (schedule) {
      setSelectedMenuId(schedule.menuId._id || schedule.menuId);
    } else {
      setSelectedMenuId("");
    }
  }, [selectedDate, menuSchedules]);

  const handleAssignMenu = async () => {
    if (!selectedMenuId) return;
    try {
      const res = await fetch("/api/dashboard/mitra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign_menu",
          date: selectedDate,
          menuId: selectedMenuId,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        const newSchedule = data.schedule;
        const otherSchedules = menuSchedules.filter(
          (s) => s.date !== selectedDate
        );
        setMenuSchedules([...otherSchedules, newSchedule]);
        alert("Menu berhasil dijadwalkan!");
      }
    } catch (error) {
      console.error("Failed to assign menu", error);
      alert("Gagal menjadwalkan menu.");
    }
  };

  const handleVerifyReport = async (reportId: string) => {
    if (!confirm("Apakah Anda yakin ingin memverifikasi laporan ini?")) return;
    try {
      const res = await fetch(`/api/lapor/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId ? { ...r, status: "resolved" } : r
          )
        );
        alert("Laporan berhasil diverifikasi.");
      }
    } catch (error) {
      console.error("Failed to verify report", error);
      alert("Gagal memverifikasi laporan.");
    }
  };

  const handleReviewReport = (reportId: string) => {
    router.push(`/lapor/${reportId}`);
  };

  const getScheduledMenu = () => {
    const schedule = menuSchedules.find((s) => s.date === selectedDate);
    return schedule ? schedule.menuId : null;
  };

  const scheduledMenu = getScheduledMenu();

  const handleAddFood = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/dashboard/mitra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_food",
          ...foodForm,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFoodItems([data.food, ...foodItems]);
        setFoodForm({
          name: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
        });
        alert("Menu berhasil ditambahkan!");
      }
    } catch (error) {
      console.error("Failed to add food", error);
      alert("Gagal menambahkan menu.");
    }
  };

  const verifiedReports = reports.filter((r) => r.status === "resolved");
  const pendingReports = reports.filter(
    (r) => r.status === "pending" || r.status === "escalated"
  );

  return (
    <MbgSidebarLayout
      activeMenu={tab ? (tab as any) : "dashboard"}
      role="mitra"
      contentClassName="bg-[#f7f5f0] min-h-screen main-content pt-[20px] px-[16px] pb-[24px] md:p-[30px]"
    >
      <Head>
        <title>Mitra Dashboard - MBG</title>
      </Head>

      {!tab || tab === "dashboard" ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Mitra
            </h1>
            <p className="text-gray-500">Selamat datang, CV Mitra Sejahtera</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Ketepatan Waktu
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats?.onTimeDelivery || 0}%
                  </h3>
                </div>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Rating Rata-rata
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats?.averageRating || 0}
                  </h3>
                </div>
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                  <i className="fas fa-star"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Total Pengiriman
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats?.totalDeliveries || 0}
                  </h3>
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <i className="fas fa-truck"></i>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Isu Pending
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats?.pendingIssues || 0}
                  </h3>
                </div>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="text-blue-600" size={20} />
                  <h3 className="text-lg font-bold text-blue-900">
                    Menu Makan Siang
                  </h3>
                </div>
                <p className="text-gray-500 text-sm capitalize">
                  {new Date(selectedDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Pilih Tanggal:</span>
                <input
                  type="date"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Menu untuk Tanggal Ini
                    </label>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={selectedMenuId}
                        onChange={(e) => setSelectedMenuId(e.target.value)}
                      >
                        <option value="">-- Pilih Menu --</option>
                        {foodItems.map((food) => (
                          <option key={food._id} value={food._id}>
                            {food.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssignMenu}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>

                {scheduledMenu ? (
                  <>
                    <div className="flex items-center justify-between mb-4 mt-6">
                      <h4 className="text-2xl font-bold text-gray-800">
                        {scheduledMenu.name}
                      </h4>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        Menu Terjadwal
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Kalori
                        </div>
                        <div className="text-xl font-bold text-blue-700">
                          {scheduledMenu.calories} kkal
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Protein
                        </div>
                        <div className="text-xl font-bold text-green-700">
                          {scheduledMenu.protein}g
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Karbo
                        </div>
                        <div className="text-xl font-bold text-orange-700">
                          {scheduledMenu.carbs}g
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Lemak
                        </div>
                        <div className="text-xl font-bold text-red-700">
                          {scheduledMenu.fat}g
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center text-gray-500">
                    Belum ada menu yang dijadwalkan untuk tanggal ini.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-900">
                ✅ Laporan yang Sudah Diverifikasi oleh BGN
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Sekolah</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Jenis Laporan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Verifikasi Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {verifiedReports.length > 0 ? (
                    verifiedReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">{report.school}</td>
                        <td className="px-6 py-4">{report.date}</td>
                        <td className="px-6 py-4">{report.type}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                            Diverifikasi
                          </span>
                        </td>
                        <td className="px-6 py-4">Admin BGN</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Tidak ada laporan terverifikasi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-900">
                ⏳ Laporan yang Belum Diverifikasi
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Sekolah</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Jenis</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Bukti Foto</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {pendingReports.length > 0 ? (
                    pendingReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          {report.school}
                        </td>
                        <td className="px-6 py-4">{report.date}</td>
                        <td className="px-6 py-4">{report.type}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              report.status === "escalated"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {report.status === "escalated"
                              ? "Eskalasi"
                              : "Menunggu"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {report.status === "escalated" ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <XCircle size={20} className="text-red-500" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {report.status === "escalated" ? (
                            <button
                              onClick={() => handleReviewReport(report.id)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-colors bg-red-500 hover:bg-red-600"
                            >
                              <Eye size={14} />
                              Tinjau
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVerifyReport(report.id)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-colors bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle size={14} />
                              Verifikasi
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Tidak ada laporan tertunda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-900">
                Data Supplier Mitra
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4">Komoditas</th>
                    <th className="px-6 py-4">Kontak</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">CV. Pangan Sehat</td>
                    <td className="px-6 py-4">Beras, Sayur</td>
                    <td className="px-6 py-4">0812...</td>
                    <td className="px-6 py-4">Aktif</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-900">
                📋 Permintaan Sekolah
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Sekolah</th>
                    <th className="px-6 py-4">Menu</th>
                    <th className="px-6 py-4">Jumlah</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {requests.length > 0 ? (
                    requests.map((req: any) => (
                      <tr
                        key={req._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          {req.schoolName}
                        </td>
                        <td className="px-6 py-4">{req.menuName}</td>
                        <td className="px-6 py-4">{req.quantity} Porsi</td>
                        <td className="px-6 py-4">
                          {new Date(req.requestDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                              req.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : req.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {req.status === "approved"
                              ? "Disetujui"
                              : req.status === "rejected"
                              ? "Ditolak"
                              : "Menunggu"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Belum ada permintaan sekolah.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-900">
                🍽️ Manajemen Menu Makanan
              </h3>
              <p className="text-gray-500 text-sm">
                Tambahkan menu makanan kustom yang Anda sediakan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Food Form */}
              <div className="lg:col-span-1">
                <form onSubmit={handleAddFood} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Makanan
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={foodForm.name}
                      onChange={(e) =>
                        setFoodForm({ ...foodForm, name: e.target.value })
                      }
                      placeholder="Contoh: Ayam Goreng Lengkuas"
                      required
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kalori (kkal)
                      </label>
                      <input
                        type="number"
                        name="calories"
                        value={foodForm.calories}
                        onChange={(e) =>
                          setFoodForm({ ...foodForm, calories: e.target.value })
                        }
                        placeholder="0"
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        name="protein"
                        value={foodForm.protein}
                        onChange={(e) =>
                          setFoodForm({ ...foodForm, protein: e.target.value })
                        }
                        placeholder="0"
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Karbo (g)
                      </label>
                      <input
                        type="number"
                        name="carbs"
                        value={foodForm.carbs}
                        onChange={(e) =>
                          setFoodForm({ ...foodForm, carbs: e.target.value })
                        }
                        placeholder="0"
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lemak (g)
                      </label>
                      <input
                        type="number"
                        name="fat"
                        value={foodForm.fat}
                        onChange={(e) =>
                          setFoodForm({ ...foodForm, fat: e.target.value })
                        }
                        placeholder="0"
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-plus" /> Tambah Menu
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Menu</th>
                        <th className="px-4 py-3">Kalori</th>
                        <th className="px-4 py-3">Protein</th>
                        <th className="px-4 py-3">Karbo</th>
                        <th className="px-4 py-3">Lemak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {foodItems.length > 0 ? (
                        foodItems.map((food: any) => (
                          <tr
                            key={food._id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium">
                              {food.name}
                            </td>
                            <td className="px-4 py-3">{food.calories}</td>
                            <td className="px-4 py-3">{food.protein}g</td>
                            <td className="px-4 py-3">{food.carbs}g</td>
                            <td className="px-4 py-3">{food.fat}g</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-6 text-center text-gray-500"
                          >
                            Belum ada menu kustom.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Polling */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-900">
                Input Polling Menu Makanan
              </h3>
            </div>
            <form
              className="space-y-4"
              id="pollForm"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Fitur polling akan segera hadir.");
              }}
            >
              <input
                type="text"
                placeholder="Judul Polling"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              />
              <select
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              >
                <option value="">Pilih Jenis</option>
                <option value="pagi">Sarapan</option>
                <option value="siang">Makan Siang</option>
              </select>
              <input
                type="date"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-plus" /> Buat Polling
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
            Halaman {tab}
          </h2>
          <p className="text-gray-500 max-w-md">
            Fitur ini sedang dalam pengembangan. Silakan kembali lagi nanti.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      )}
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
      `}</style>
    </MbgSidebarLayout>
  );
}
